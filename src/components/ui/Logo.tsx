import Link from "next/link";
import Image from "next/image";

const Logo = ({ href = "/", className = "" }) => {
  return (
    // <Link href={href} className={`text-2xl font-bold ${className}`}>
    <Link
      href={href}
      className={`flex items-center space-x-2 text-2xl font-bold ${className}`}
    >
      <Image
        src="/android-chrome-512x512.png"
        alt="Sansho Logo"
        width={320}
        className="w-7 h-7 border-transparent border-2 rounded-2xl"
        height={320}
      />
      <span>
        <span className="text-blue-600 dark:text-sky-400">Sansho</span>
        <span className="text-gray-900 dark:text-white">धनम्</span>
      </span>
    </Link>
  );
};

export default Logo;
