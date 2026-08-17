import { NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_TU-KEY-AQUI";

export async function POST(req: Request) {
  try {
    const { priceId, planName, email } = await req.json();

    // Si no hay Stripe configurado, devolver un mensaje claro
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: "Stripe no configurado. Agrega STRIPE_SECRET_KEY en Vercel.",
          demo: true,
          checkoutUrl: `https://checkout.stripe.com/c/pay/demo?plan=${planName}`,
        },
        { status: 200 }
      );
    }

    // Import dinámico para no romper el build sin stripe server instalado
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/#pricing?canceled=true`,
      customer_email: email || undefined,
      metadata: { plan: planName },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}