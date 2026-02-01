import {Outfit} from 'next/font/google';
import Footer from './Footer';

const outfit = Outfit({
    subsets: ['latin'],
})

const FifthScreen =()=>{
    return(
        <div className="min-h-screen bg-neutral-200 flex flex-col">
            <h1> This is the Fifth Screen</h1>

        </div>
    )
}
export default FifthScreen;