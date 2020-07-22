import React, { Component } from 'react';
import ReactListView from 'react-custom-list-view';
import list from './mock/list';
import { sleep } from './utils';

const totalLength = 100;
let count = 0;

export default class App extends Component {
  state = {
    hasMore: true,
    list: [],
  };

  loadMore = async () => {
    if (!this.state.hasMore) return;

    if (count >= totalLength) {
      await sleep(500);
      this.setState({
        hasMore: false,
      });
    } else {
      await sleep(500);
      count += list.length;
      this.setState((prevState, _) => {
        return {
          list: prevState.list.concat(list),
          hasMore: true,
        };
      });
    }
  };

  renderItem = (item, index) => {
    return (
      <div className={'list-item'} key={index}>
        <div className="avatar-container">
          <img src={item.img} className="avatar" alt="" />
        </div>
        <div className="title">{item.text}</div>
      </div>
    );
  };

  render() {
    const { hasMore, list } = this.state;
    return (
      <div>
        <ReactListView
          // containerHeight={400}
          loadMore={this.loadMore}
          renderItem={this.renderItem}
          hasMore={hasMore}
          list={list}
        />
      </div>
    );
  }
}
