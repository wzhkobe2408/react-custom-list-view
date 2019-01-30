import React, { Component } from 'react';

import ReactListView from 'react-list-view';

export default class App extends Component {
  containerHeight = 600;
  threshhold = 100;
  loadMore = async () => {
    const data = [
      { text: 'Mike is Programming' },
      { text: 'Jack is Play Basketball' },
      { text: 'John is Singing' },
      { text: 'Rose is Dancing' },
      { text: 'Sarah is Writing' },
      { text: 'Mike is Programming' },
      { text: 'Jack is Play Basketball' },
      { text: 'John is Singing' },
      { text: 'Rose is Dancing' },
      { text: 'Sarah is Writing' },
    ];
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(data), 1000);
    });
  };
  renderList = list => {
    if (list.length <= 0) return null;
    return (
      <div>
        {list.map((item, index) => (
          <div className={'list-item'} key={index}>
            {item.text}
          </div>
        ))}
      </div>
    );
  };
  render() {
    return (
      <div>
        <ReactListView
          loadMore={this.loadMore}
          containerHeight={this.containerHeight}
          threshhold={this.threshhold}
          renderList={this.renderList}
        />
      </div>
    );
  }
}
