'use client'

import React, { useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface UploadProgress {
    filename: string;
    uploaded: number;
    total: number;
    percentage: number;
}

const FileUploadComponent: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        // 소켓 연결
        const newSocket = io('http://localhost:13332/upload', {
            transports: ['websocket', 'polling'],
            timeout: 10000,
        });

        // 연결 이벤트
        newSocket.on('connect', () => {
            console.log('업로드 소켓 연결됨:', newSocket.id);
            setConnected(true);
        });

        // 서버 메시지 수신
        newSocket.on('message', (data: string) => {
            console.log('서버 메시지:', data);
        });

        // 연결 해제
        newSocket.on('disconnect', () => {
            console.log('업로드 소켓 연결 해제됨');
            setConnected(false);
        });

        // 연결 오류
        newSocket.on('connect_error', (error) => {
            console.error('소켓 연결 오류:', error);
            setConnected(false);
        });

        setSocket(newSocket);

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            newSocket.close();
        };
    }, []);

    // 파일 청크 업로드 함수
    const uploadFileInChunks = useCallback(async (file: File) => {
        if (!socket || !connected) {
            alert('소켓이 연결되지 않았습니다.');
            return;
        }

        const chunkSize = 500 *1024; // 64KB
        const totalChunks = Math.ceil(file.size / chunkSize);

        // 진행률 초기화
        setUploadProgress(prev => ({
            ...prev,
            [file.name]: {
                filename: file.name,
                uploaded: 0,
                total: totalChunks,
                percentage: 0
            }
        }));

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            // 청크를 ArrayBuffer로 읽기
            const arrayBuffer = await chunk.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            // 서버로 청크 전송
            socket.emit('upload-chunk', {
                filename: file.name,
                index: i,
                total: totalChunks,
                data: Array.from(uint8Array) // Buffer 호환을 위해 Array로 변환
            });

            // 진행률 업데이트
            const percentage = Math.round(((i + 1) / totalChunks) * 100);
            setUploadProgress((prev : Record<string,any> )=> ({
                ...prev as any,
                [file.name]: {
                    ...prev[file.name],
                    uploaded: i + 1,
                    percentage: percentage
                }
            }));

            // 청크 간 약간의 지연 (서버 부하 방지)
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        console.log(`${file.name} 업로드 완료`);
    }, [socket, connected]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            uploadFileInChunks(selectedFile);
        }
    };

    return (
        <div style={{ padding: '20px' }
        }>
            <h3>파일 업로드(Socket.IO) </h3>
            < div >
                <strong>연결 상태: </strong> {connected ? '연결됨' : '연결 안됨'}
            </div>

            < div style={{ margin: '20px 0' }}>
                <input
                    type="file"
                    onChange={handleFileSelect}
                    disabled={!connected}
                />
                < button
                    onClick={handleUpload}
                    disabled={!connected || !selectedFile}
                    style={{ marginLeft: '10px' }}
                >
                    업로드
                </button>
            </div>

            {
                Object.values(uploadProgress).map((progress) => (
                    <div key={progress.filename} style={{ margin: '10px 0' }}>
                        <div>{progress.filename} </div>
                        <div>
                            진행률: {progress.uploaded}/{progress.total} ({progress.percentage}%)
                        </div>
                        < div style={{
                            width: '100%',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div
                                style={
                                    {
                                        width: `${progress.percentage}%`,
                                        height: '20px',
                                        backgroundColor: '#4CAF50',
                                        transition: 'width 0.3s ease'
                                    }
                                }
                            />
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default FileUploadComponent;