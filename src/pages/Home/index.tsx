import React from 'react';
import { invoke } from "@tauri-apps/api/tauri";
//监听事件
import { listen } from "@tauri-apps/api/event";
//用于格式化date
import format from 'date-fns/format';

import './index.css';

//用于取消监听
let unlisten: any = null

//事件的消息体
interface Payload {
    message: Array<string>,
    timestamp: number,
}

class Home extends React.Component {

    //初始状态
    state = {
        message: [],
        timestamp: "",
        time: ""
    }

    //开始监听
    start = () => {
        invoke('init_process');
        //防止重复监听
        if (unlisten != null) {
            console.log("already listen");
            return;
        }

        const start_listen = async () => {
            //注意这里的my-event名称，要与后端保持一致
            return await listen<Payload>('my-event', (event) => {
                const { message, timestamp } = event.payload;
                console.log("message:", message,
                    "timestamp:", timestamp, "time:",
                    format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss.SSS'));
                this.setState({ message, timestamp, "time": format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss.SSS') })

            });
        };
        unlisten = start_listen();
    }

    //停止监听
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