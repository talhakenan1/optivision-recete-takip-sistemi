
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function useCustomers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: customers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      console.log("Fetching customers for user:", user.id);
      
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching customers:", error);
        throw error;
      }
      
      console.log("Fetched customers:", data);
      return data || [];
    },
    enabled: !!user,
  });

  const addCustomer = useMutation({
    mutationFn: async (customer: { name: string; email: string; phone?: string; id_number: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      console.log("Adding customer for user:", user.id);
      
      // Check if customer with same ID number already exists for this user
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("id")
        .eq("id_number", customer.id_number)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingCustomer) {
        throw new Error("There is already a customer with this ID number");
      }
      
      const { data, error } = await supabase
        .from("customers")
        .insert([{ ...customer, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error("Error adding customer:", error);
        throw error;
      }
      
      console.log("Added customer:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", user?.id] });
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
    },
    onError: (error: any) => {
      console.error("Customer creation error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    customers,
    isLoading,
    error,
    addCustomer: addCustomer.mutate,
    isAddingCustomer: addCustomer.isPending,
  };
}
