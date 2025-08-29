// const User = require('../../models/User');

// const resolvers = {
//   Query: {
//     users: async () => {
//       try {
//         return await User.find();
//       } catch (err) {
//         console.error(err);
//         return [];
//       }
//     },
//   },

// Mutation: {
//     addUser: async (_, { name, email, role }) => {
//       const newUser = new User({ name, email, role });
//       return await newUser.save();
//     },
//     deleteUser: async (_, { id }) => {
//       try {
//         return await User.findByIdAndDelete(id);
//       } catch (err) {
//         console.error(err);
//         throw new Error('Failed to delete user');
//       }
//     },
//     updateUser: async (_, { id, name, email }) => {
//         try {
//           const updatedUser = await User.findByIdAndUpdate(
//             id,
//             { name, email }, // fields to update
//             { new: true }    // return the updated document
//           );
  
//           if (!updatedUser) {
//             throw new Error("User not found");
//           }
  
//           return updatedUser;
//         } catch (error) {
//           throw new Error(error.message);
//         }
//       },
//   }
  

// };

// module.exports = resolvers;


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



