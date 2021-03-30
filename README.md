# wsu-class-check-v2
This is an altered version of the original that takes into consideration Duo 2FA.

#### Check to see if a certain WSU class is open using its CRN. You'll receive an email (gmail) if it's full or not.
##### `NOTE`: the email you use for this will require you to go to https://myaccount.google.com/lesssecureapps and allow less secure apps. Check out https://nodemailer.com/usage/using-gmail/ for more information.
#### Default interval is 5 minutes

# Install packages
---
Using npm:
```
npm install
```

## Create an env file in the parent directory with these values
---
    WS_CHROME_ENDPOINT_URL=''
    CRN=''
    EMAIL=''
    EMAILPASSWORD=''
## Get the Chrome instance for puppeteer to connect to:
---
## `Mac`
#### run this command in your terminal:
```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
```
#### You should see an output like this:
```
DevTools listening on ws://127.0.0.1:9222/devtools/browser/27c12cd0-5f74-4738-b439-a73aa212aea5
```

## `Windows`
    1. Right click on your Google Chrome shortcut icon then click Properties
    2. In Target field, add to the very end `--remote-debugging-port=9222`
    3. Click “Apply” and re-launch Chrome
    4. Open a browser to `http://127.0.0.1:9222/json/version`
    
#### Copy the ws (include ws) and store it in WS_CHROME_ENDPOINT_URL
#### Fill out the rest of the env values

### `NOTE`: You have to first sign into wsu once and complete the duo 2-factor for this to work. Once you do this you can run the script successfully
