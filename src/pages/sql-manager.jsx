import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import Editor from '@monaco-editor/react';
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { toJSON, toXML } from '../utils/parser';

const SqlManager = () => {
    
    const [isRunning, setIsRunning] = useState(false);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    const editorRequestRef = useRef(null);


    useEffect(() => {


    }, []);

    function handleEditorRequestDidMount(editor, monaco) {
        editorRequestRef.current = editor;
    }

    function executeQuery() {

        setIsRunning(true);

        let query = editorRequestRef.current.getValue();

        let data = `<perform_exec_db_query>
                        <parameters>
                            <sql_command>${query}</sql_command>
                        </parameters>
                    </perform_exec_db_query>`


        const auth = localStorage.getItem("auth");

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://proxy-server-mu-bice.vercel.app/?target=https://elex-fsm-dev.ifs.cloud/MetrixIntegrationService/M5WebService.asmx/ProcessMessage',
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
                                manageResponse(response.data)
                            })
                            .catch((error) => {
                                console.log(error);
                                setIsRunning(false);
                            });

    }

    function manageResponse(xmlString) {

        xmlString = xmlString
                            .replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .replace(/&#39;/g, "'");
    
            const parser = new DOMParser();
            const srcDOM = parser.parseFromString(xmlString, "application/xml");
    
            let j = toJSON(srcDOM);
            let v = j.perform_exec_db_query_result.response.NewDataSet.execute_sql_result;
            // console.log(v);
            setColumns(Object.keys(v[0]));
            setData(v);
    }
    

    return(
        <div>
            <div className="text-right m-4">
                <Button isIconOnly color="success" aria-label="run" size="sm" onClick={executeQuery} isLoading={isRunning}>
                    <FontAwesomeIcon icon="fa-solid fa-play" />
                </Button> 
            </div>
            <Editor className="mt-4 resize-y" height="50vh" defaultLanguage="sql" onMount={handleEditorRequestDidMount} defaultValue='select top 10 * from task'/>
            
            <h3 className="mt-4">Data</h3>
           
            {data.length > 0 ? (
            <Table aria-label="Example table with dynamic content"
            selectionMode="single">
      <TableHeader>
        {columns.map((column) =>
          <TableColumn key={column} allowsSorting>{column} </TableColumn>
        )}
      </TableHeader>
      <TableBody>
        {data.map((row, index) =>
          <TableRow key={index}>
            {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>): (
        <h1>No data available</h1>
      )}

        </div>
    );
};


export default SqlManager;