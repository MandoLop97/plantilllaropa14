import React, { useState } from "react";
import MinimalAdminLayout from "@/admin/components/MinimalAdminLayout";
import { PackageOpen, Scissors, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProductos from "./AdminProductos";
import AdminServicios from "./AdminServicios";
import AdminCategorias from "./AdminCategorias";
export default function AdminInventario() {
  const [activeTab, setActiveTab] = useState<string>("productos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  return <MinimalAdminLayout>
      <div className="space-y-3 p-2 md:p-4 max-w-7xl mx-auto">
        {/* Compact Header Section */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="space-y-1">
              <h1 className="text-lg md:text-2xl font-bold text-foreground flex items-center gap-2 text-center py-0 px-0">
                <PackageOpen className="h-4 w-4 md:h-5 md:w-5" />
                Inventario
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Gestiona tus productos, servicios y categorías
              </p>
            </div>
          </div>
        </div>

        {/* Compact Tabs */}
        <Tabs defaultValue="productos" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30 h-9 md:h-10">
            <TabsTrigger value="productos" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <PackageOpen className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Productos</span>
            </TabsTrigger>
            <TabsTrigger value="servicios" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <Scissors className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Servicios</span>
            </TabsTrigger>
            <TabsTrigger value="categorias" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <Tag className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Categorías</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-3 md:mt-4">
            <TabsContent value="productos" className="m-0">
              <AdminProductos searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </TabsContent>
            <TabsContent value="servicios" className="m-0">
              <AdminServicios searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </TabsContent>
            <TabsContent value="categorias" className="m-0">
              <AdminCategorias searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MinimalAdminLayout>;
}