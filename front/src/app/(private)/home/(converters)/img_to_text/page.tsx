'use client'

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Image, FileText, Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useOcrConverter } from '@/hooks/converters/use_ocr_converter';

function App() {
    const [file, setFile] = useState<File | null>(null);
    const { mutate, isPending, data, reset } = useOcrConverter();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5MB
    });

    const handleConvert = () => {
        if (file) {
            mutate(file, {
                onSuccess: () => {
                    toast({
                        title: 'Ошибка',
                        description: 'Не удалось обработать изображение',
                        variant: 'destructive',
                    })
                },
                onError: () => {
                    toast({
                        title: 'Ошибка',
                        description: 'Не удалось обработать изображение',
                        variant: 'destructive',
                    });
                },
            });
        }
    };

    const handleReset = () => {
        setFile(null);
        reset();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Card className="shadow-lg overflow-hidden">
                    <CardHeader className="border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    Конвертер фото в текст
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Загрузите изображение для извлечения текста
                                </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                                {file && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleReset}
                                        disabled={isPending}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Сбросить
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        {!file ? (
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <Upload className="w-12 h-12 text-gray-400" />
                                    <p className="text-lg font-medium text-gray-700">
                                        {isDragActive
                                            ? 'Отпустите для загрузки'
                                            : 'Перетащите изображение или кликните для выбора'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Поддерживаются JPG, PNG, WEBP (макс. 5MB)
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <Image className="w-10 h-10 text-blue-500" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleReset}
                                        disabled={isPending}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                {isPending && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">
                                                Обработка изображения...
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                <Loader2 className="w-4 h-4 animate-spin inline mr-1" />
                                            </span>
                                        </div>
                                        <Progress value={50} className="h-2" />
                                    </div>
                                )}

                                {data?.text && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-green-600">
                                            <Check className="w-5 h-5" />
                                            <span className="font-medium">
                                                Текст успешно извлечен!
                                            </span>
                                        </div>
                                        <Textarea
                                            value={data.text}
                                            readOnly
                                            className="min-h-[200px] font-mono text-sm"
                                        />
                                        <div className="flex justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(data.text);
                                                    toast({
                                                        title: 'Текст скопирован',
                                                        description: 'Текст успешно скопирован в буфер обмена',
                                                    });
                                                }}
                                            >
                                                Копировать текст
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex justify-end w-full">
                            {file && !data?.text && !isPending && (
                                <Button onClick={handleConvert}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Конвертировать в текст
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                </Card>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Использует технологию OCR для распознавания текста на изображениях</p>
                </div>
            </div>
        </div>
    );
}

export default App;