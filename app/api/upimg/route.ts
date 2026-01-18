import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser to handle large files
  },
};

// Menangani POST request
export async function POST(req: Request) {
  const formData = await req.formData(); // Menggunakan FormData untuk mendapatkan file

  const file = formData.get('file'); // Mengambil file dari form data (pastikan nama fieldnya sesuai)

  if (!file || !(file instanceof File)) {
    return new Response(JSON.stringify({ message: 'No file found' }), {
      status: 400,
    });
  }

  const filename = file.name;
  const filePath = path.resolve('.', 'uploads', `${filename}`);

  // Menyimpan file
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return new Response(
    JSON.stringify({ message: 'File uploaded successfully' }),
    { status: 200 }
  );
}
