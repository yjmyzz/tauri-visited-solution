import React from 'react'
import { invoke } from '@tauri-apps/api'
import { WebviewWindow } from '@tauri-apps/api/window'

export default function Home() {

    let open_about = () => {
        //创建1个窗口
        const webview = new WebviewWindow('about2', {
            url: '/about',
            title: "另1个关于我们",
            width: 480,
            height: 360,
            x: 100,
            y: 200
        })
        webview.once('tauri://created', function () {
            // alert("About窗口创建成功！")
        })
        webview.once('tauri://error', function (e) {
            //如果窗口已经打开，再次尝试重复打开时，会报错
            // alert("About窗口创建失败！")
        })
    }

    /**
     * 
     * @param label 关闭窗口
     */
    let close_about = (label: string) => {
        const win = WebviewWindow.getByLabel(label);
        win?.close();
    }

    return (
        <p>
            <h2>Home Window</h2>
            <button onClick={() => invoke("open_about")}>open about 1</button>
            <button onClick={() => open_about()}>open about 2</button>
            <button onClick={() => close_about('about')}>close about </button>
            <button onClick={() => close_about('about2')}>close about 2</button>
        </p>
    )
}
