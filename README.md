# Hi-Tec Walking Route

Create walking routes from a list of places in Amsterdam, hand-picked by Hi-Tec Ambassadors. [Here is an online demo](http://spaaza.github.io/hitec-walking-route/).

## Basics

### Install

    npm install

### Run

    npm start

## NPM Tasks

### Compile JS

    npm run build:js

### Compile CSS

    npm run build:css

### Compile content

    npm run build:content

## Add new content

To add a new place you'll need to create a YAML file in the ```content``` folder. This is an example of the structure needed to process the information:

``` yaml
    id: "ChIJSRE-IcUJxkcRCltjPmVdmtQ"
    label: "Anne Frank Huis"
    category: "Typical Amsterdam"
    content:
      - "Iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla. Option congue nihil imperdiet doming id quod mazim placerat facer possim."
      - "Ea commodo consequat duis autem vel eum iriure dolor in hendrerit? Litterarum formas humanitatis per seacula quarta decima et quinta decima eodem modo typi."
    author:
      name: "Shannon Banks"
      role: "Fashion designer"
      picture: "assets/img/avatars/ShannonBanks.jpg"
    media:
      x2: 'assets/img/x2/annefrank.jpg'
      x3: 'assets/img/x3/annefrank.jpg'
```

After creating the new files, you'll need to run the content compilation script in order to process and inject the new content into the app.

## Remove content

Just remove the files from ```content``` folder. After creating the new files, you'll need to run the content compilation script in order to process and inject the new content into the app.
