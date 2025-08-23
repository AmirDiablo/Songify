import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const Chart = ({artistId}) => {
    const [infos, setinfos] = useState([])

    const ListenersInfos = async()=> {
        const response = await fetch("http://localhost:3000/api/account/listenerStatics/"+artistId)
        const json = await response.json()

        if(response.ok) {
            setinfos(json)
        }
    }

    useEffect(()=> {
        ListenersInfos()
    }, [])

    return ( 
        <div className=''>

            <div style={{ width: '100%', height: 400 }}>
                <strong className='ml-10'>Monthly Listener Trend</strong>
                <ResponsiveContainer>
                    <LineChart data={infos} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="listenersCount" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                </div>

        </div>
     );
}
 
export default Chart;