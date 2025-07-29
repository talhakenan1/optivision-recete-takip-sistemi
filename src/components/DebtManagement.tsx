import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar, DollarSign, User, Clock, Send, Plus, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useAuth } from '@/hooks/useAuth'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
}

interface Debt {
  id: string
  customer_id: string
  amount: number
  due_date: string
  description?: string
  status: string
  created_at: string
  customers: Customer
  user_id: string
  updated_at: string
}

interface Reminder {
  id: string
  debt_id: string
  reminder_type: string
  status: string
  sent_at?: string
  created_at: string
  error_message?: string
  message_content?: string
  scheduled_date: string
  user_id: string
}

const DebtManagement: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const [newDebt, setNewDebt] = useState({
    customer_id: '',
    amount: '',
    due_date: '',
    description: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('name')

      if (customersError) throw customersError
      setCustomers(customersData || [])

      // Fetch debts with customer info
      const { data: debtsData, error: debtsError } = await supabase
        .from('debts')
        .select(`
          *,
          customers(
            id,
            name,
            email,
            phone
          )
        `)
        .order('due_date', { ascending: true })

      if (debtsError) throw debtsError
      setDebts(debtsData || [])

      // Fetch recent reminders
      const { data: remindersData, error: remindersError } = await supabase
        .from('reminders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (remindersError) throw remindersError
      setReminders(remindersData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Hata',
        description: 'Veriler yüklenirken bir hata oluştu.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddDebt = async () => {
    try {
      if (!newDebt.customer_id || !newDebt.amount || !newDebt.due_date) {
        toast({
          title: 'Hata',
          description: 'Lütfen tüm gerekli alanları doldurun.',
          variant: 'destructive'
        })
        return
      }

      const { error } = await supabase
        .from('debts')
        .insert({
          customer_id: newDebt.customer_id,
          amount: parseFloat(newDebt.amount),
          due_date: newDebt.due_date,
          description: newDebt.description,
          status: 'pending',
          user_id: user?.id || ''
        })

      if (error) throw error

      toast({
        title: 'Başarılı',
        description: 'Borç kaydı eklendi.'
      })

      setNewDebt({ customer_id: '', amount: '', due_date: '', description: '' })
      setIsAddDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error adding debt:', error)
      toast({
        title: 'Hata',
        description: 'Borç eklenirken bir hata oluştu.',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateDebtStatus = async (debtId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('debts')
        .update({ status })
        .eq('id', debtId)

      if (error) throw error

      toast({
        title: 'Başarılı',
        description: 'Borç durumu güncellendi.'
      })

      fetchData()
    } catch (error) {
      console.error('Error updating debt status:', error)
      toast({
        title: 'Hata',
        description: 'Borç durumu güncellenirken bir hata oluştu.',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteDebt = async (debtId: string) => {
    try {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', debtId)

      if (error) throw error

      toast({
        title: 'Başarılı',
        description: 'Borç kaydı silindi.'
      })

      fetchData()
    } catch (error) {
      console.error('Error deleting debt:', error)
      toast({
        title: 'Hata',
        description: 'Borç silinirken bir hata oluştu.',
        variant: 'destructive'
      })
    }
  }

  const handleSendReminders = async () => {
    try {
      if (!user?.id) {
        toast({
          title: 'Hata',
          description: 'Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.',
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Bilgi',
        description: 'Hatırlatmalar gönderiliyor...'
      })

      const { data, error } = await supabase.functions.invoke('send-reminders', {
        body: { user_id: user.id }
      })
      
      if (error) {
        console.error('Supabase function error:', error)
        throw new Error(error.message || 'Edge function çağrısında hata oluştu')
      }

      toast({
        title: 'Başarılı',
        description: `Hatırlatmalar gönderildi. ${data?.sent || 0} başarılı, ${data?.errors || 0} hata.`
      })

      fetchData()
    } catch (error: any) {
      console.error('Error sending reminders:', error)
      toast({
        title: 'Hata',
        description: error?.message || 'Hatırlatmalar gönderilirken bir hata oluştu.',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Beklemede</Badge>
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ödendi</Badge>
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Gecikmiş</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Borç Yönetimi</h1>
          <p className="text-muted-foreground">Müşteri borçlarını takip edin ve hatırlatmalar gönderin</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSendReminders} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Hatırlatma Gönder
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Yeni Borç
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Borç Ekle</DialogTitle>
                <DialogDescription>
                  Müşteri için yeni bir borç kaydı oluşturun.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer">Müşteri</Label>
                  <Select value={newDebt.customer_id} onValueChange={(value) => setNewDebt({...newDebt, customer_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Müşteri seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Tutar (₺)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newDebt.amount}
                    onChange={(e) => setNewDebt({...newDebt, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="due_date">Vade Tarihi</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={newDebt.due_date}
                    onChange={(e) => setNewDebt({...newDebt, due_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={newDebt.description}
                    onChange={(e) => setNewDebt({...newDebt, description: e.target.value})}
                    placeholder="Borç açıklaması..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button onClick={handleAddDebt}>
                    Ekle
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Borç</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(debts.reduce((sum, debt) => debt.status === 'pending' ? sum + debt.amount : sum, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Borçlar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {debts.filter(debt => debt.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gecikmiş Borçlar</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {debts.filter(debt => debt.status === 'overdue' || (debt.status === 'pending' && new Date(debt.due_date) < new Date())).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Müşteri Sayısı</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Borç Listesi</CardTitle>
          <CardDescription>
            Tüm müşteri borçlarını görüntüleyin ve yönetin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Müşteri</th>
                  <th className="text-left p-2">Tutar</th>
                  <th className="text-left p-2">Vade Tarihi</th>
                  <th className="text-left p-2">Durum</th>
                  <th className="text-left p-2">Açıklama</th>
                  <th className="text-left p-2">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {debts.map((debt) => (
                  <tr key={debt.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{debt.customers.name}</div>
                        <div className="text-sm text-gray-500">{debt.customers.email}</div>
                      </div>
                    </td>
                    <td className="p-2 font-medium">{formatCurrency(debt.amount)}</td>
                    <td className="p-2">
                      <div className={`${new Date(debt.due_date) < new Date() && debt.status === 'pending' ? 'text-red-600 font-medium' : ''}`}>
                        {formatDate(debt.due_date)}
                      </div>
                    </td>
                    <td className="p-2">{getStatusBadge(debt.status)}</td>
                    <td className="p-2 max-w-xs truncate">{debt.description || '-'}</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        {debt.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateDebtStatus(debt.id, 'paid')}
                          >
                            Ödendi
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Borcu Sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu borç kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteDebt(debt.id)}>
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {debts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Henüz borç kaydı bulunmuyor.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Son Hatırlatmalar</CardTitle>
          <CardDescription>
            Gönderilen hatırlatmaların geçmişi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {reminders.slice(0, 10).map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Badge variant={reminder.reminder_type === 'email' ? 'default' : 'secondary'}>
                    {reminder.reminder_type === 'email' ? 'E-posta' : 'Telegram'}
                  </Badge>
                  <span className="text-sm">
                    {reminder.sent_at ? formatDate(reminder.sent_at) : 'Gönderilmedi'}
                  </span>
                </div>
                <Badge variant={reminder.status === 'sent' ? 'default' : 'destructive'}>
                  {reminder.status === 'sent' ? 'Gönderildi' : 'Başarısız'}
                </Badge>
              </div>
            ))}
            {reminders.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Henüz hatırlatma gönderilmemiş.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DebtManagement