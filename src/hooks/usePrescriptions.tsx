
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface PrescriptionData {
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  phone: string;
  productInfo: string;
  visionType: string;
  sph: string;
  cyl: string;
  axis: string;
  distanceVision: string;
  nearVision: string;
  price?: number;
  purchaseDate: Date;
}

export function usePrescriptions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: prescriptions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("prescriptions")
        .select(`
          *,
          customers (
            name,
            email,
            phone
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addPrescription = useMutation({
    mutationFn: async (prescriptionData: PrescriptionData) => {
      if (!user) throw new Error("User not authenticated");
      
      console.log("Adding prescription with data:", prescriptionData);
      
      // First, check if customer exists by ID number
      const { data: existingCustomer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id_number", prescriptionData.idNumber)
        .maybeSingle();

      if (customerError) {
        console.error("Error checking customer:", customerError);
        throw customerError;
      }

      let customerId;

      if (!existingCustomer) {
        // Create new customer
        console.log("Creating new customer");
        const { data: newCustomer, error: createError } = await supabase
          .from("customers")
          .insert([{
            name: `${prescriptionData.firstName} ${prescriptionData.lastName}`,
            email: prescriptionData.email,
            phone: prescriptionData.phone,
            id_number: prescriptionData.idNumber,
            user_id: user.id,
          }])
          .select()
          .single();

        if (createError) {
          console.error("Error creating customer:", createError);
          throw createError;
        }
        customerId = newCustomer.id;
        console.log("New customer created with ID:", customerId);
      } else {
        customerId = existingCustomer.id;
        console.log("Using existing customer with ID:", customerId);
      }

      // Create order
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert([{
          customer_id: customerId,
          total: prescriptionData.price || 0,
          order_date: prescriptionData.purchaseDate.toISOString().split('T')[0],
          status: "new",
          user_id: user.id,
        }])
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
        throw orderError;
      }

      console.log("Order created with ID:", newOrder.id);

      // Create prescription
      const prescriptionRecord = {
        customer_id: customerId,
        order_id: newOrder.id,
        email: prescriptionData.email,
        phone: prescriptionData.phone,
        id_number: prescriptionData.idNumber,
        price: prescriptionData.price,
        user_id: user.id,
        prescription_data: {
          firstName: prescriptionData.firstName,
          lastName: prescriptionData.lastName,
          productInfo: prescriptionData.productInfo,
          visionType: prescriptionData.visionType,
          sph: prescriptionData.sph,
          cyl: prescriptionData.cyl,
          axis: prescriptionData.axis,
          distanceVision: prescriptionData.distanceVision,
          nearVision: prescriptionData.nearVision,
          purchaseDate: prescriptionData.purchaseDate.toISOString(),
        }
      };

      console.log("Creating prescription:", prescriptionRecord);

      const { data: prescription, error: prescriptionError } = await supabase
        .from("prescriptions")
        .insert([prescriptionRecord])
        .select()
        .single();

      if (prescriptionError) {
        console.error("Error creating prescription:", prescriptionError);
        throw prescriptionError;
      }

      console.log("Prescription created successfully:", prescription);
      return prescription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast({
        title: "Success",
        description: "Prescription saved successfully",
      });
    },
    onError: (error: any) => {
      console.error("Prescription creation error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    prescriptions,
    isLoading,
    error,
    addPrescription: addPrescription.mutate,
    isAddingPrescription: addPrescription.isPending,
  };
}
