"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'admin@example.com';
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });
    if (!existingAdmin) {
        const hashedPassword = await bcryptjs_1.default.hash('Admin@123', 10);
        const adminUser = await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log(`Admin user created: ${adminUser.email}`);
    }
    else {
        console.log('Admin user already exists.');
    }
    // Optional: Add a normal user for testing
    const userEmail = 'user@example.com';
    const existingUser = await prisma.user.findUnique({
        where: { email: userEmail }
    });
    if (!existingUser) {
        const hashedPassword = await bcryptjs_1.default.hash('User@123', 10);
        const regularUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: userEmail,
                password: hashedPassword,
                role: 'USER'
            }
        });
        console.log(`Test user created: ${regularUser.email}`);
    }
}
main()
    .catch((e) => {
    console.error('Error in seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
