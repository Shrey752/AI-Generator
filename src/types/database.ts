export interface Database {
  public: {
    Tables: {
      buyers: {
        Row: {
          id: string
          company_name: string
          gst_number: string | null
          contact_name: string
          phone: string
          email: string
          city: string
          created_at: string
          status: 'active' | 'suspended'
        }
        Insert: {
          id?: string
          company_name: string
          gst_number?: string | null
          contact_name: string
          phone: string
          email: string
          city: string
          created_at?: string
          status?: 'active' | 'suspended'
        }
        Update: {
          id?: string
          company_name?: string
          gst_number?: string | null
          contact_name?: string
          phone?: string
          email?: string
          city?: string
          created_at?: string
          status?: 'active' | 'suspended'
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category_id: string | null
          fabric_composition: string | null
          weave_type: string | null
          width: string | null
          gsm: number | null
          status: 'active' | 'draft' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category_id?: string | null
          fabric_composition?: string | null
          weave_type?: string | null
          width?: string | null
          gsm?: number | null
          status?: 'active' | 'draft' | 'archived'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category_id?: string | null
          fabric_composition?: string | null
          weave_type?: string | null
          width?: string | null
          gsm?: number | null
          status?: 'active' | 'draft' | 'archived'
          created_at?: string
        }
      }
      product_colors: {
        Row: {
          id: string
          product_id: string
          color_name: string
          color_hex: string | null
        }
        Insert: {
          id?: string
          product_id: string
          color_name: string
          color_hex?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          color_name?: string
          color_hex?: string | null
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          sort_order?: number
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          sort_order?: number
        }
      }
      enquiries: {
        Row: {
          id: string
          buyer_id: string
          status: 'new' | 'called' | 'quoted' | 'closed'
          submitted_at: string
          admin_notes: string | null
        }
        Insert: {
          id?: string
          buyer_id: string
          status?: 'new' | 'called' | 'quoted' | 'closed'
          submitted_at?: string
          admin_notes?: string | null
        }
        Update: {
          id?: string
          buyer_id?: string
          status?: 'new' | 'called' | 'quoted' | 'closed'
          submitted_at?: string
          admin_notes?: string | null
        }
      }
      enquiry_items: {
        Row: {
          id: string
          enquiry_id: string
          product_id: string
          quantity: string | null
          preferred_shade: string | null
          buyer_notes: string | null
        }
        Insert: {
          id?: string
          enquiry_id: string
          product_id: string
          quantity?: string | null
          preferred_shade?: string | null
          buyer_notes?: string | null
        }
        Update: {
          id?: string
          enquiry_id?: string
          product_id?: string
          quantity?: string | null
          preferred_shade?: string | null
          buyer_notes?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Buyer = Database['public']['Tables']['buyers']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductColor = Database['public']['Tables']['product_colors']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type Enquiry = Database['public']['Tables']['enquiries']['Row']
export type EnquiryItem = Database['public']['Tables']['enquiry_items']['Row']

export type ProductFull = Product & {
  categories: Category | null
  product_colors: ProductColor[]
  product_images: ProductImage[]
}

export type EnquiryFull = Enquiry & {
  buyers: Buyer
  enquiry_items: (EnquiryItem & { products: Product | null })[]
}
