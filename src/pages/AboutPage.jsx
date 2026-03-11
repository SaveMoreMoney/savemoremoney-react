import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import TableOfContents from '../components/TableOfContents';
import './AboutPage.css';

const AboutPage = () => {
  const contentRef = useRef(null);

  return (
    <>
      <Helmet>
        <title>About Me | SaveMoreMoney.in</title>
        <meta name="description" content="Learn more about Nishant Gupta and the mission behind SaveMoreMoney.in to help everyone become financially independent." />
      </Helmet>
      <div className="about-page-container">
        <div className="about-layout">
          <main className="about-main-content">
            <div className="about-content">
              <h1>About Me & SaveMoreMoney.in</h1>
              
              <div ref={contentRef}>
                <p className="intro">
                  Savemoremoney.in was started with an aim to simplify personal finance and help everyone become financially independent.
                </p>

                <section>
                  <h2 id="our-mission">Our Mission</h2>
                  <p>
                    Personal finance is a very important concept which unfortunately is not taught in many school or college in India. This may be the reason why most people find it difficult to manage their personal finances. With the rise in inflation and increasing cases of job loss, it is important that we get into the habit of understanding our personal finances and start saving more money than we currently do. Savemoremoney.in helps you achieve just that by detailing out new & effective ways to help you save money / earn passive income and enjoy financial freedom.
                  </p>
                  <p>
                    Through my articles, I will be sharing simple tips and tricks to help you save money in your everyday life, improve your personal finance, plan your investments and retirement, understand insurance in a better way (more than just a tool for tax savings), show you the power of credit cards (when used properly) and as a bonus, also help you save money when planning your vacations (under the Travel section). All of these via simple to understand articles.
                  </p>
                </section>

                <section className="bio">
                  <h2 id="meet-nishant">Hi.. I’m Nishant Gupta,</h2>
                  <p>
                    while education has given me an engineering and MBA degree, my interest in personal finance, credit cards & insurance motivated me to start Savemoremoney.in
                  </p>
                  <p>
                    My interest in Personal Finance started in 2010. Initially, it was limited to Mutual Funds. Gradually, I realized that I need a good understanding of many aspects of Finance to achieve my dream of becoming Financially Free and retiring early.
                  </p>
                  <p>
                    So over time, I explored and have invested in both traditional and modern ways of earning money.
                  </p>
                  <p>
                    My extensive knowledge on the subject has gotten my articles published on websites like Digital People, Medium and others.
                  </p>
                  <p>
                    I am based out of Pune, lead a loan free life and will be Financially Free in a few years. With an aim to retire early (by early-40s), I like to keep exploring new ideas and ways of earning and saving money.
                  </p>
                  
                  <h3 id="entrepreneurial-journey">Entrepreneurial Journey</h3>
                  <p>
                    Before entering the blogging world, I had done a stint as an entrepreneur when I co-founded my business (Home Meal). I had a tough but amazing learning experience while running it for almost a year. However, our funds ran out and we were unable to find any VCs and hence had to take the tough decision to closing it down. But the experience gained has helped me understand how things work in business.
                  </p>
                  <p>
                    My readers & friends keep telling me that I somehow, constantly find new ways to get discounts / free vouchers / gift coupons / saving money. I will be sharing the secrets to these via my blog posts so you too can take advantage of these hacks.
                  </p>
                </section>

                <section className="contact">
                  <h2 id="get-in-touch">Get In Touch</h2>
                  <p>
                    I will be happy to have your suggestions on topics you want to read about on my website. Please feel free to share your thoughts and ideas to <a href="mailto:hello@savemoremoney.in">hello@savemoremoney.in</a>
                  </p>
                </section>
              </div>
            </div>
          </main>
          
          <aside className="about-sidebar">
            <TableOfContents contentRef={contentRef} />
          </aside>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
