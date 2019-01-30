# react-list-view

> A listview component for ReactJS

[![NPM](https://img.shields.io/npm/v/react-list-view.svg)](https://www.npmjs.com/package/react-list-view) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-custom-list-view
```

## Usage

```tsx
import * as React from 'react';

import ReactListView from 'react-list-view';

class App extends React.Component {
  render() {
    return (
      <ReactListView
        loadMore={this.loadMore}
        containerHeight={this.containerHeight}
        threshhold={this.threshhold}
        renderList={this.renderList}
      />
    );
  }
}
```

## License

MIT © [wzhkobe2408](https://github.com/wzhkobe2408)
