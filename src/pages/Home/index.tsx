import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import format from 'date-fns/format';
import React from 'react';
import './index.css';

let unlisten: any = null

interface Payload {
    message: Array<string>,
    timestamp: string,
}

class Home extends React.Component {

    state = {
        message: [],
        timestamp: "",
        time: ""
    }

    start = () => {
        invoke('init_process');
        //防止重复监听
        if (unlisten != null) {
            console.log("already listen");
            return;
        }

        const start_listen = async () => {
            return await listen<Payload>('my-event', (event) => {
                const { message, timestamp } = event.payload;
                console.log("message:", message,
                    "timestamp:", timestamp, "time:",
                    format(new Date(Number.parseFloat(timestamp)), 'yyyy-MM-dd HH:mm:ss.SSS'));
                this.setState({ message, timestamp, "time": format(new Date(Number.parseFloat(timestamp)), 'yyyy-MM-dd HH:mm:ss.SSS') })

            });
        };
        unlisten = start_listen();
    }

    stop = () => {
        console.log("is_listening:", unlisten != null);
        if (unlisten != null) {
            unlisten.then((ok: any) => {
                ok();
                unlisten = null;
                console.log("stop success");
            }).catch((err: any) => {
                console.log("stop fail", err);
            })
        }
    }

    render() {
        return (
            <div>
                <button onClick={() => this.start()}>start</button>&nbsp;
                <button onClick={() => this.stop()}>stop</button><br />
                <h4>{this.state.time}</h4>
                <div >
                    {
                        this.state.message.map((item, index) => {
                            return (<span className="monitor" key={`${this.state.timestamp}_${index}`}> {item}</span>)
                        })
                    }
                </div>
            </div >
        )
    }
}

export default Home