'use client'

import { Fragment, useState, useRef } from "react"
import { UploadFileList, UploadFileListRef } from "./upload-file-list.file";
import { UploadFileItemObject } from "@web/lib/zustand-state/file.state";

export const AddFilePageContext = () => {


    const fileRef = useRef<HTMLInputElement>(null);

    const [page, setPage] = useState<number>(1);

    const listRef = useRef<UploadFileListRef>(null);

    const [enableNext, setNextState] = useState<boolean>(false);

    const [countState, setCountState] = useState<{ waiting?: number, running?: number, complete?: number, error?: number, total?: number }>({})


    const listChangeEventHandler = (items: UploadFileItemObject[]) => {
        setNextState(items.filter(x => x.state !== 'complete').length === 0)
        setCountState({
            waiting: items.filter(x => x.state === 'waiting').length,
            complete: items.filter(x => x.state === 'complete').length,
            error: items.filter(x => x.state === 'error').length,
            running: items.filter(x => x.state === 'running').length,
            total: items.length,
        })
    }

    const clearEventHandler = () => {
        listRef.current?.reset();
    }


    return (
        <Fragment>
            <div className="cp-page-header">
                Add Files
            </div>
            <div className="cp-page-context">
                <div className="cp-add-progress">
                    {page}
                </div>
                <div className="cp-upload-context">
                    <div className="cp-upload-box">
                        <div
                            className="cp-text-box"
                        >
                            <span>Upload</span>
                            <button
                                className="cp-upload-button"
                                onClick={() => fileRef.current?.click()}
                            >
                                Upload Files
                            </button>
                            <input
                                type="file"
                                className="cp-upload-file-input"
                                ref={fileRef}
                                multiple
                                onChange={(e) => {
                                    listRef.current?.appendFiles(Array.from(e.currentTarget.files ?? []));
                                    e.target.value = '';
                                }}
                            />
                        </div>
                        <div className="cp-file-box">
                            <div className="cp-file-panel">
                                <span>진행중 : {(countState.running ?? 0) + (countState.waiting ?? 0)} | 완료 : {countState.complete} | 오류 : {countState.error} | 전체 : {countState.total}</span>
                                <button onClick={clearEventHandler}>Clear</button>
                            </div>
                            <UploadFileList
                                ref={listRef}
                                className="cp-file-list"
                                onChange={listChangeEventHandler}
                            />
                        </div>
                    </div>

                </div>
                <div className="cp-action-box">
                    <button disabled={!enableNext}>NEXT</button>
                </div>
            </div>
        </Fragment>
    )
}
