import { FaArrowLeftLong } from "react-icons/fa6";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center w-full">
      <h1 className="text-5xl font-extrabold text-center text-gray-700">
        <span className="text-red-700">!</span>Jira
      </h1>
      <div className="mx-5 my-10 text-center">
        <section className="text-3xl max-w-200">
          La Task Management Application che ti aiutera' a rimanere sempre
          efficiente nella gestione dei tuoi task e dei tuoi progetti
        </section>
        <section className="mt-30 text-xl flex flex-row gap-5 items-center justify-center">
          <FaArrowLeftLong className=" max-lg:hidden" />
          Clicca nella Dashboard per iniziare la creazione di nuovi Task e la
          gestione di quelli esistenti
        </section>
      </div>
      {/* <img src="/home_image.svg" alt="home_image" /> */}
    </div>
  );
}
