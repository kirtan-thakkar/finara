import { Outfit } from 'next/font/google';
import Link from 'next/link'
const outfit = Outfit({
    subsets: ['latin'],
})
const links = [
    {
        title: 'Instagram',
        href: 'https://www.instagram.com/kirtan.p.v.t/',
    },
    {
        title: 'linkedin',
        href: 'https://www.linkedin.com/in/kirtan007/',
    },
    {
        title: 'Github',
        href: '#https://github.com/kirtan-thakkar',
    },
]

export default function FooterSection() {
    return (
        <footer className="border-t border-gray-300 bg-white py-6 dark:bg-transparent dark:border-gray-600">
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex flex-wrap justify-between gap-6">
                    <span
                        className={`text-muted-foreground order-last block text-center text-sm md:order-first ${outfit.className}`}>© {new Date().getFullYear()} Finara, All rights reserved</span>
                    <div
                        className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary block duration-150">
                                <span className={`${outfit.className}`}>{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
