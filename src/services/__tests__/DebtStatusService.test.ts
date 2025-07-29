import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DebtStatusService } from '../DebtStatusService'
import { supabase } from '@/integrations/supabase/client'

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          lt: vi.fn(() => ({
            single: vi.fn(),
          })),
          single: vi.fn(),
        })),
        lt: vi.fn(() => ({
          eq: vi.fn(),
        })),
        in: vi.fn(),
        order: vi.fn(),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          lt: vi.fn(() => ({
            select: vi.fn(),
          })),
          select: vi.fn(),
        })),
        in: vi.fn(() => ({
          select: vi.fn(),
        })),
      })),
      insert: vi.fn(),
    })),
  },
}))

describe('DebtStatusService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('updateOverdueDebts', () => {
    it('should successfully update overdue debts', async () => {
      const mockOverdueDebts = [
        { id: '1', status: 'pending', due_date: '2024-01-01', customer_id: 'c1', amount: 100 },
        { id: '2', status: 'pending', due_date: '2024-01-02', customer_id: 'c2', amount: 200 },
      ]

      const mockUpdatedDebts = [
        { id: '1', status: 'overdue' },
        { id: '2', status: 'overdue' },
      ]

      // Mock the select query for overdue debts
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          lt: vi.fn().mockResolvedValue({
            data: mockOverdueDebts,
            error: null,
          }),
        }),
      })

      // Mock the update query
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          lt: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({
              data: mockUpdatedDebts,
              error: null,
            }),
          }),
        }),
      })

      // Mock the insert for logging
      const mockInsert = vi.fn().mockResolvedValue({ error: null })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'debts') {
          return {
            select: mockSelect,
            update: mockUpdate,
          } as any
        } else if (table === 'debt_status_log') {
          return {
            insert: mockInsert,
          } as any
        }
        return {} as any
      })

      const result = await DebtStatusService.updateOverdueDebts()

      expect(result.success).toBe(true)
      expect(result.updated_count).toBe(2)
      expect(result.errors).toHaveLength(0)
      expect(mockSelect).toHaveBeenCalled()
      expect(mockUpdate).toHaveBeenCalled()
      expect(mockInsert).toHaveBeenCalled()
    })

    it('should handle case when no overdue debts exist', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          lt: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await DebtStatusService.updateOverdueDebts()

      expect(result.success).toBe(true)
      expect(result.updated_count).toBe(0)
      expect(result.errors).toHaveLength(0)
    })

    it('should handle database errors gracefully', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          lt: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database connection failed' },
          }),
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await DebtStatusService.updateOverdueDebts()

      expect(result.success).toBe(false)
      expect(result.updated_count).toBe(0)
      expect(result.errors).toContain('Database connection failed')
    })
  })

  describe('scheduleStatusUpdate', () => {
    it('should successfully update debt status', async () => {
      const mockCurrentDebt = { id: '1', status: 'pending' }

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockCurrentDebt,
            error: null,
          }),
        }),
      })

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })

      const mockInsert = vi.fn().mockResolvedValue({ error: null })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'debts') {
          return {
            select: mockSelect,
            update: mockUpdate,
          } as any
        } else if (table === 'debt_status_log') {
          return {
            insert: mockInsert,
          } as any
        }
        return {} as any
      })

      const result = await DebtStatusService.scheduleStatusUpdate('1', 'paid', 'Manual payment', 'user1')

      expect(result).toBe(true)
      expect(mockSelect).toHaveBeenCalled()
      expect(mockUpdate).toHaveBeenCalled()
      expect(mockInsert).toHaveBeenCalled()
    })

    it('should reject invalid status transitions', async () => {
      const mockCurrentDebt = { id: '1', status: 'paid' }

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockCurrentDebt,
            error: null,
          }),
        }),
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await DebtStatusService.scheduleStatusUpdate('1', 'overdue')

      expect(result).toBe(false)
    })
  })

  describe('getDebtStatusSummary', () => {
    it('should return correct debt status summary', async () => {
      const mockDebts = [
        { status: 'pending' },
        { status: 'pending' },
        { status: 'overdue' },
        { status: 'paid' },
      ]

      const mockSelect = vi.fn().mockResolvedValue({
        data: mockDebts,
        error: null,
      })

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await DebtStatusService.getDebtStatusSummary()

      expect(result.total).toBe(4)
      expect(result.pending).toBe(2)
      expect(result.overdue).toBe(1)
      expect(result.paid).toBe(1)
      expect(result.cancelled).toBe(0)
    })
  })

  describe('batchUpdateDebtStatus', () => {
    it('should successfully update multiple debts', async () => {
      const mockCurrentDebts = [
        { id: '1', status: 'pending' },
        { id: '2', status: 'pending' },
      ]

      const mockUpdatedDebts = [
        { id: '1' },
        { id: '2' },
      ]

      const mockSelect = vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({
          data: mockCurrentDebts,
          error: null,
        }),
      })

      const mockUpdate = vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: mockUpdatedDebts,
            error: null,
          }),
        }),
      })

      const mockInsert = vi.fn().mockResolvedValue({ error: null })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'debts') {
          return {
            select: mockSelect,
            update: mockUpdate,
          } as any
        } else if (table === 'debt_status_log') {
          return {
            insert: mockInsert,
          } as any
        }
        return {} as any
      })

      const result = await DebtStatusService.batchUpdateDebtStatus(['1', '2'], 'paid')

      expect(result.success).toBe(true)
      expect(result.updated_count).toBe(2)
      expect(result.errors).toHaveLength(0)
    })

    it('should handle empty debt IDs array', async () => {
      const result = await DebtStatusService.batchUpdateDebtStatus([], 'paid')

      expect(result.success).toBe(true)
      expect(result.updated_count).toBe(0)
      expect(result.errors).toHaveLength(0)
    })
  })
})