import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { orderId, amount, currency } = await request.json();

        const merchantId = process.env.PAYHERE_MERCHANT_ID;
        const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

        if (!merchantId || !merchantSecret) {
            return NextResponse.json({ error: 'PayHere credentials missing' }, { status: 500 });
        }

        // Format amount to 2 decimal places
        const formattedAmount = Number(amount).toLocaleString('en-us', { minimumFractionDigits: 2 }).replaceAll(',', '');

        const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
        const mainHash = crypto.createHash('md5')
            .update(merchantId + orderId + formattedAmount + currency + hashedSecret)
            .digest('hex')
            .toUpperCase();

        return NextResponse.json({ hash: mainHash });
    } catch (error) {
        console.error('Hash generation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
