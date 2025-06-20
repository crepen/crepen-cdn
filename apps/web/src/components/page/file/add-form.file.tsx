'use client'

import * as FileAction from "@web/lib/action/file.action";
import { useFormAction } from "@web/lib/hook/form-action.hook";
import { StringUtil } from "@web/lib/util/string.util";
import { ChangeEvent, FormEvent, Fragment, useActionState, useEffect, useRef } from "react";

interface AddFileFormProp {
    folderUid: string
}

const AddFileForm = (prop: AddFileFormProp) => {

    const folderUid = prop.folderUid;
    const imageRef = useRef<HTMLImageElement>(null);

    const uploadFileTextRef = useRef<HTMLInputElement>(null);
    const uploadFileDataInputRef = useRef<HTMLInputElement>(null);

    const fileTitleInputRef = useRef<HTMLInputElement>(null);

    const ss = useFormAction({
        action : FileAction.addFile
    })

  

    const fileUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {


        if ((e.target.files?.length ?? 0) > 0 && imageRef.current) {

            const file = e.target.files![0];

            if (uploadFileTextRef.current) {
                uploadFileTextRef.current.value = file?.name ?? '';

                if (StringUtil.isEmpty(fileTitleInputRef.current?.value)) {
                    if (fileTitleInputRef.current) {
                        fileTitleInputRef.current.value = file?.name ?? '';
                    }

                }
            }


            if (file?.type.split('/')[0] === 'image') {
                const reader = new FileReader();

                reader.onloadend = () => {
                    // Data URL은 reader.result에 저장됩니다.
                    imageRef.current!.src = reader.result?.toString() ?? '';
                }

                if (file) {
                    reader.readAsDataURL(file);
                } else {
                    imageRef.current!.src = "";
                }
            }

        }
    }

    const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        ss.submit(formData);
        
        e.preventDefault();
    }

    useEffect(() => {
        if(ss.state === 'complete'){
            if(ss.data?.success !== true){
                alert(ss.data?.message);
            }
        }
    },[ss])

    return (
        <Fragment>
            <div className="cp-page-header">
                <span>ADD FILES</span>
            </div>
            <div className="cp-page-context">
                <div className="left-context">
                    <div className="upload-file-preview">
                        <img src="#" ref={imageRef} />
                    </div>
                </div>
                <div className="right-context">
                    <form className="add-form" onSubmit={onSubmitHandler}>
                        <div className="form-item cp-form-title">
                            <span className="form-item-title">Title</span>
                            <input type="text" ref={fileTitleInputRef} name="form-title" />
                        </div>
                        <div className="form-item cp-form-upload">
                            <span className="form-item-title">Upload File</span>
                            <div className="cp-upload-box">
                                <input
                                    className="cp-upload-file-name"
                                    type="text"
                                    ref={uploadFileTextRef}
                                    placeholder=""
                                    disabled
                                />
                                <button
                                    className="cp-upload-file-button"
                                    type="button"
                                    onClick={() => uploadFileDataInputRef.current?.click()}
                                >
                                    Upload
                                </button>
                                <input
                                    id='upload-file'
                                    type="file"
                                    onChange={fileUploadHandler}
                                    ref={uploadFileDataInputRef}
                                    name="form-file"
                                />
                            </div>

                        </div>
                        <div className="form-item">
                            <span className="form-item-title">Options</span>
                            <div className="form-item linear-item">
                                <div className="linear-item-title">Shared</div>
                                <div className="linear-item-value">
                                    <input type="checkbox" name="form-option-shared" />
                                </div>
                            </div>
                            <div className="form-item">
                                <div className="linear-item-title"></div>
                                <div className="linear-item-value"></div>
                            </div>
                        </div>
                        <div className="form-item">
                            <button type="submit">SUBMIT</button>
                            {ss.state === 'running' ? 'PENDING' : ''}
                        </div>
                    </form>
                </div>

            </div>
        </Fragment>
    )

}

export default AddFileForm;