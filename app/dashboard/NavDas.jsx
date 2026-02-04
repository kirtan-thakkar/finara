import { Outfit } from "next/font/google";
const outfit = Outfit({
    subsets: ["latin"],
    weight: ["400", "700"]
})

const Navbar =()=>{
    return(
        <div className="navbar h-10px">
            <h1>This is teh the Navbar of the Dashbaord and it would contain the tabs 

            </h1>
            <p>
                or it would contain the link i dont know right now but yes it will redirect the user to the repective pages. so this is the overall idea behind this Navbar. 
            </p>
        </div>
    )
}
export default Navbar;