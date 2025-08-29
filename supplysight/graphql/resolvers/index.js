const products = [
  { id: "1", name: "Bolts", sku: "HEX-22-105", stock: 280, demand: 150, warehouse: "New York", status: "Healthy" },
  { id: "2", name: "Nuts", sku: "NUT-03-120", stock: 100, demand: 100, warehouse: "Los Angeles", status: "Low" },
  { id: "3", name: "Washers", sku: "WSH-30-190", stock: 40, demand: 100, warehouse: "Chicago", status: "Critical" },
];

const resolvers = {
  Query: {
    products: () => products,
    product: (_, { id }) => products.find(p => p.id === id),
  },
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const product = products.find(p => p.id === id);
      if (!product) throw new Error("Product not found");
      product.demand = demand;
      // recalc status
      if (product.stock >= demand) product.status = "Healthy";
      else if (product.stock >= demand * 0.5) product.status = "Low";
      else product.status = "Critical";
      return product;
      
    },
    transferStock: (_, { id, stock }) => {
      const product = products.find(p => p.id === id);
      if (!product) throw new Error("Product not found");
      product.stock += stock;
      // recalc status
      if (product.stock >= product.demand) product.status = "Healthy";
      else if (product.stock >= product.demand * 0.5) product.status = "Low";
      else product.status = "Critical";
      return product;
    },
  },
};

module.exports = resolvers;



