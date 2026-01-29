import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
    private supabase: SupabaseClient;
    private bucketName: string;

    constructor(private readonly config: ConfigService) {
        const supabaseUrl = this.config.getOrThrow<string>('SUPABASE_URL');
        const supabaseKey = this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');
        this.bucketName = this.config.getOrThrow<string>('SUPABASE_STORAGE_BUCKET');

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    /**
     * Upload a file to Supabase Storage
     * @param file Buffer of the file
     * @param folder Destination folder in the bucket
     * @param fileName Original filename or custom name
     * @returns Public URL of the uploaded file
     */
    async uploadFile(file: Buffer, folder: string, fileName: string, bucketName?: string): Promise<string> {
        const timestamp = Date.now();
        const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
        const path = `${folder}/${timestamp}-${cleanFileName}`;
        const targetBucket = bucketName || this.bucketName;

        const { data, error } = await this.supabase.storage
            .from(targetBucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Supabase Storage Error:', error);
            throw new InternalServerErrorException('Error al subir el archivo a Supabase Storage');
        }

        const { data: publicUrlData } = this.supabase.storage
            .from(targetBucket)
            .getPublicUrl(data.path);

        return publicUrlData.publicUrl;
    }

    /**
     * Delete a file from Supabase Storage
     * @param path Full path of the file in the bucket
     */
    async deleteFile(path: string): Promise<void> {
        const { error } = await this.supabase.storage
            .from(this.bucketName)
            .remove([path]);

        if (error) {
            console.error('Supabase Storage Error:', error);
            throw new InternalServerErrorException('Error al eliminar el archivo de Supabase Storage');
        }
    }
}
