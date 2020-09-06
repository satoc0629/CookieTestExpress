import React from "react"

const Index = () => {
    function getCookie(e: any) {
        fetch("http://localhost:3000/", {
            method: 'GET',
            mode: "cors",
            credentials: "include"
        }).then((r: Response) => {
            console.log(JSON.stringify(r))
            console.log(r.statusText)
            document.cookie = r.headers.get('Set-Cookie') as string
        })
    }

    return <>
        Hellow React TSX.
        <p>
            <button onClick={getCookie}>GetCookie</button>
        </p>
    </>
}
export default Index