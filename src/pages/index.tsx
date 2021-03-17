import { GetStaticProps } from "next";
import { collectedNotes } from "collected-notes";
import { HomePageProps } from "types";
import { HomeLayout } from "layouts/home";

const cn = collectedNotes(process.env.CN_EMAIL, process.env.CN_TOKEN);

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const { site, notes } = await cn.site(
    process.env.CN_SITE_PATH,
    1,
    "public_site"
  );

  // fetch all pages
  if (notes.length < site.total_notes) {
    for await (let page of Array.from(
      { length: Math.ceil(site.total_notes / 40) },
      (_, index) => index + 1
    )) {
      if (page === 1) continue;
      const res = await cn.site(process.env.CN_SITE_PATH, page, "public_site");
      notes.push(...res.notes);
    }
  }

  return { props: { site, notes }, revalidate: 1 };
};

export default HomeLayout;

export const Blog = () => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <p className="mb-2 text-xs font-semibold tracking-wide text-gray-600 uppercase sm:text-center">
        20 Nov 2020
      </p>
      <div className="max-w-xl mb-5 md:mx-auto sm:text-center lg:max-w-2xl">
        <div className="mb-4">
          <a
            href="/"
            aria-label="Article"
            className="inline-block max-w-lg font-sans text-3xl font-extrabold leading-none tracking-tight text-black transition-colors duration-200 hover:text-deep-purple-accent-700 sm:text-4xl"
          >
            The quick, brown fox jumps over a lazy dog
          </a>
        </div>
        <p className="text-base text-gray-700 md:text-lg">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque rem aperiam, eaque ipsa quae.
        </p>
      </div>
      <div className="mb-10 sm:text-center">
        <a href="/" aria-label="Author" className="inline-block mb-1">
          <img
            alt="avatar"
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
            className="object-cover w-10 h-10 rounded-full shadow-sm"
          />
        </a>
        <div>
          <a
            href="/"
            aria-label="Author"
            className="font-semibold text-gray-800 transition-colors duration-200 hover:text-deep-purple-accent-700"
          >
            Vasile Melinte
          </a>
          <p className="text-sm font-medium leading-4 text-gray-600">Author</p>
        </div>
      </div>
      <div className="sm:text-center">
        <a
          href="/"
          aria-label=""
          className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
        >
          Read more
        </a>
      </div>
    </div>
  );
};
