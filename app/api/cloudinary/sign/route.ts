import { NextRequest, NextResponse } from 'next/server';
import { generateSignedUploadParams } from '@/lib/cloudinary';
import { getCurrentUser, isStaffRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    // Allow signed uploads for corporate logo uploads by guests or admin product images
    const body = await request.json().catch(() => ({}));
    const folder = body.folder || (isStaffRole(user?.role) ? 'elyrion/products' : 'elyrion/corporate-logos');

    const params = generateSignedUploadParams(folder);

    return NextResponse.json(params);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
