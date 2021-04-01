const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const wsChromeEndpointurl = process.env.WS_CHROME_ENDPOINT_URL;

const Email = {
  sendEmail: function (mailContent) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `CRN ${process.env.CRN} Class Check (${mailContent.classIsOpen})`,
      text: `${mailContent.classIsOpen} and ${mailContent.waitListOpen}`,
      html: `
          <h3>Open Status: ${mailContent.classIsOpen}</h3>
          <h3>Waitlist Status: ${mailContent.waitListOpen}</h3>
          <p>Image Result: <img src="cid:supposedlyunique" /></p>
        `,
      attachments: [
        {
          filename: 'checkresult.png',
          path: './testingthepuppet6.png',
          cid: 'supposedlyunique',
        },
      ],
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },
};

// cron.schedule('*/5 * * * *', () => {
  const test = async function () {
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsChromeEndpointurl,
    });
    const page = await browser.newPage();
    await page.goto(
      'https://registration.wayne.edu/StudentRegistrationSsb/ssb/registration/registration'
    );

    await page.click('#classSearchLink');

    // IT'S ONE OF THESE SELECTORS
    await page.waitForSelector('#s2id_txt_term', { visible: true });
    // await page.click('#term-select');
    // await page.click('#term-window');
    // await page.click('#term-search-combobox');
    await page.click('#s2id_txt_term');
    // await page.click('.select2-container');
    // await page.click('.term-combo2');

    await page.keyboard.type('Spring/Summer 2021');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.click('#term-go');

    await page.waitForSelector('#txt_courseNumber', { visible: true });
    await page.type('#txt_keywordlike', process.env.CRN);
    await page.click('#search-go');

    await page.waitForSelector('.status-bold', { visible: true });
    await page.screenshot({ path: 'testingthepuppet6.png' });

    let mob = await page.evaluate(() => {
      let classIsOpen = "you shouldn't see this";
      let waitListOpen = 'waitlist was never checked (must be open)';
      let meep = () => {
        if (document.querySelector('.status-full'))
          //if the class is full
          return document.querySelector('.status-full');
        return document.querySelector('.status-bold'); //if it's not
      };
      let classOpenSpan = () => {
        if (meep() === document.querySelector('.status-full'))
          return meep().querySelector('.status-bold');
        return '';
      };
      let waitList = () => {
        // if it's not open, check the waitlist
        if (meep() === document.querySelector('.status-full'))
          return document.querySelector('.status-waitlist');
        // if the class is open, don't worry about the waitlist
        return '';
      };
      let waitListSpan = () => {
        if (waitList() === document.querySelector('.status-waitlist'))
          return waitList().querySelector('.status-bold');
        return '';
      };

      if (classOpenSpan().innerHTML === 'FULL') {
        console.log('STILL FULL');
        classIsOpen = 'STILL FULL';

        // if the class is full check if the waitlist is open
        if (waitListSpan().innerHTML === '0') {
          console.log('WAITLIST FULL');
          waitListOpen = 'WAITLIST FULL';
        } else {
          console.log('WAITLIST OPEN');
          waitListOpen = 'WAITLIST OPEN';
        }
      } else {
        console.log('OPEN...or something went wrong');
        classIsOpen = "IT'S OPEN...or something went wrong";
      }

      let message = {
        classIsOpen,
        waitListOpen,
      };

      return message;
    });

    await page.goto('about:blank');
    await page.close();
    return mob;
  };

  test().then((res) => {
    Email.sendEmail(res);
  });
// });
