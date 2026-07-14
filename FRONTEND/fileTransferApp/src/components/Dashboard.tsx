import { Receiver } from "./Receiver"
import { Sender } from "./Sender"


export const Dashboard = () => {
  return (
    <>
        <div className="DashBoard" style={{gap:"2rem"}}>
            <Sender/>
            <Receiver/>

        </div>




    </>
  )
}
