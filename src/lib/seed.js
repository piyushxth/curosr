import 'dotenv/config';
import connectMongoDB from './db';
import { Category, Product, User } from '../models';
import bcrypt from 'bcryptjs';

const categories = [
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Comfortable and stylish t-shirts for everyday wear',
    image: '/images/categories/t-shirts.jpg',
  },
  {
    name: 'Jeans',
    slug: 'jeans',
    description: 'Classic and modern jeans for all occasions',
    image: '/images/categories/jeans.jpg',
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Trendy and comfortable footwear for every style',
    image: '/images/categories/shoes.jpg',
  },
];

const products = [
  // T-Shirts
  {
    name: 'Classic White T-Shirt',
    slug: 'classic-white-t-shirt',
    description: 'A timeless white t-shirt made from 100% cotton',
    price: 29.99,
    images: ['/images/products/white-tshirt-1.jpg', '/images/products/white-tshirt-2.jpg'],
    category: 't-shirts',
    stock: 100,
    featured: true,
  },
  {
    name: 'Black Graphic T-Shirt',
    slug: 'black-graphic-t-shirt',
    description: 'Stylish black t-shirt with modern graphic design',
    price: 34.99,
    images: ['/images/products/black-tshirt-1.jpg', '/images/products/black-tshirt-2.jpg'],
    category: 't-shirts',
    stock: 75,
    featured: false,
  },
  // Jeans
  {
    name: 'Slim Fit Blue Jeans',
    slug: 'slim-fit-blue-jeans',
    description: 'Modern slim fit jeans in classic blue',
    price: 79.99,
    images: ['/images/products/blue-jeans-1.jpg', '/images/products/blue-jeans-2.jpg'],
    category: 'jeans',
    stock: 50,
    featured: true,
  },
  {
    name: 'Black Skinny Jeans',
    slug: 'black-skinny-jeans',
    description: 'Versatile black skinny jeans for any outfit',
    price: 69.99,
    images: ['/images/products/black-jeans-1.jpg', '/images/products/black-jeans-2.jpg'],
    category: 'jeans',
    stock: 60,
    featured: false,
  },
  // Shoes
  {
    name: 'White Sneakers',
    slug: 'white-sneakers',
    description: 'Classic white sneakers for everyday comfort',
    price: 89.99,
    images: ['/images/products/white-shoes-1.jpg', '/images/products/white-shoes-2.jpg'],
    category: 'shoes',
    stock: 40,
    featured: true,
  },
  {
    name: 'Black Leather Boots',
    slug: 'black-leather-boots',
    description: 'Stylish black leather boots for a bold look',
    price: 129.99,
    images: ['/images/products/black-boots-1.jpg', '/images/products/black-boots-2.jpg'],
    category: 'shoes',
    stock: 30,
    featured: false,
  },
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user',
  },
];

async function seed() {
  try {
    await connectMongoDB();

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create categories
    const createdCategories = await Category.create(categories);
    console.log('Categories created successfully');

    // Create products with category references
    const productsWithCategories = products.map(product => ({
      ...product,
      category: createdCategories.find(cat => cat.slug === product.category)?._id,
    }));
    await Product.create(productsWithCategories);
    console.log('Products created successfully');

    // Create users with hashed passwords
    const usersWithHashedPasswords = await Promise.all(
      users.map(async user => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    await User.create(usersWithHashedPasswords);
    console.log('Users created successfully');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 