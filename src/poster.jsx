import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import Editor from '@monaco-editor/react';
import { Button } from "@nextui-org/react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Poster = () => {
    
    const [isRunning, setIsRunning] = useState(false);

    const editorRequestRef = useRef(null);
    const editorResponseRef = useRef(null);

    function handleEditorRequestDidMount(editor, monaco) {
        editorRequestRef.current = editor;
    }

    function handleEditorResponseDidMount(editor, monaco) {
        editorResponseRef.current = editor;
    }

    function executeQuery() {

        setIsRunning(true);

        editorResponseRef.current.setValue("");

        let data = editorRequestRef.current.getValue();

        // let data = "<perform_get_server_info />";

        const auth = localStorage.getItem("auth");

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://proxy-server-mu-bice.vercel.app/?target=https://elex-fsm-dev.ifs.cloud/MetrixIntegrationService/M5WebService.asmx/ProcessMessage',
            // url: 'https://elex-fsm-dev.ifs.cloud/MetrixIntegrationService/M5WebService.asmx/ProcessMessage',
            headers: { 
                'Content-Type': 'application/xml', 
                'Authorization': `Basic ${auth}`,
            },
            data : data,
        };

        axios.request(config)
        .then((response) => {
            // console.log(response.data);
            setIsRunning(false);
            editorResponseRef.current.setValue(response.data);
        })
        .catch((error) => {
            console.log(error);
            setIsRunning(false);
        });

    }

    return(
        <div>
            <div className="text-right m-4">
                <Button isIconOnly color="success" aria-label="run" size="sm" onClick={executeQuery} isLoading={isRunning}>
                    <FontAwesomeIcon icon="fa-solid fa-play" />
                </Button> 
            </div>
            <Editor className="mt-4 resize-y" height="50vh" defaultLanguage="xml" onMount={handleEditorRequestDidMount} defaultValue='<perform_get_server_info />'/>
            
            <h3 className="mt-4">Response</h3>
            <Editor height="50vh" defaultLanguage="xml" onMount={handleEditorResponseDidMount} />


        </div>
    );
};

export default Poster;