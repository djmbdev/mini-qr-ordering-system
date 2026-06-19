import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CartItemInput {
  id: string;
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  totalAmount: number;
  items: CartItemInput[];
}

// Get all orders for admin dashboard
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// Post submit order from checkout cart
export async function POST(request: Request) {
  try {
    // Test purposes only, caps orders at 10 to test the cart limit
    const orderCount = await prisma.order.count();
    if (orderCount >= 10) {
      return NextResponse.json(
        {
          error:
            "System capacity reached. Please contact admin to clear records.",
        },
        { status: 403 },
      );
    }

    const body: CreateOrderInput = await request.json();
    const { totalAmount, items } = body;

    const newOrder = await prisma.order.create({
      data: {
        totalAmount,
        status: "pending",
        items: {
          create: items.map((item: CartItemInput) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 },
    );
  }
}

// Test purposes only, deletes all orders to reset order count during testing
export async function DELETE() {
  try {
    const { count } = await prisma.order.deleteMany({});
    return NextResponse.json(
      { message: `Deleted ${count} order(s)`, count },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete orders" },
      { status: 500 },
    );
  }
}
