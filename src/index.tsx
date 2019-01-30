/**
 * @class ListView
 */

import * as React from 'react';

import styles from './styles.css';

export type Props = {
  /**
   * 滚动到底部距离限制 -> 触发加载
   */
  threshhold: number;
  /**
   * 容器高度
   */
  containerHeight: number;
  /**
   * 渲染列表
   */
  renderList: Function;
  /**
   * 加载更多数据
   */
  loadMore: Function;
};

export type State = {
  /**
   * 列表数据
   */
  list: any[];
  /**
   * 滚动距容器底部的距离
   */
  scrollBottomDistance: number;
  /**
   * 是否还有更多数据
   */
  hasMore: boolean;
  /**
   * 是否处于加载状态
   */
  loading: boolean;
};

export default class ListView extends React.Component<Props, State> {
  state: State = {
    list: [],
    scrollBottomDistance: Number.POSITIVE_INFINITY,
    hasMore: false,
    loading: false,
  };

  containerRef: HTMLDivElement;

  bindRef = (ref: HTMLDivElement) => {
    if (ref) {
      this.containerRef = ref;
    }
  };

  startLoading = () => {
    this.setState(() => {
      return {
        hasMore: true,
        loading: true,
      };
    });
  };

  finishLoading = () => {
    this.setState(() => {
      return {
        hasMore: true,
        loading: false,
      };
    });
  };

  async componentDidMount() {
    const { loadMore } = this.props;
    this.startLoading();
    const list = await loadMore();
    this.setState((prevState, _) => {
      return {
        list: prevState.list.concat(list),
      };
    });
    this.containerRef.style.height =
      (this.containerRef.clientHeight - 50).toString() + 'px';
    this.finishLoading();
  }
  /**
   * 容器滚动监听函数
   */
  onHandleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    e.persist();
    const {
      currentTarget: { clientHeight, scrollHeight, scrollTop },
    } = e;
    if (scrollTop + clientHeight === scrollHeight) {
      this.startLoading();
      const list = await this.props.loadMore();
      this.setState((prevState, _) => {
        return {
          list: prevState.list.concat(list),
        };
      });
      this.finishLoading();
    }
  };

  /**
   * 渲染加载提示
   */
  renderLoadingHint = () => {
    const { threshhold } = this.props;
    const { hasMore, loading, scrollBottomDistance } = this.state;
    return (
      <div className={styles.loadingHint}>
        {hasMore && loading && scrollBottomDistance >= threshhold ? (
          <div>正在为您努力加载...</div>
        ) : null}
        {!hasMore && loading && scrollBottomDistance >= threshhold ? (
          <div>暂无更多数据</div>
        ) : null}
      </div>
    );
  };

  render() {
    const { renderList } = this.props;
    const { list } = this.state;
    return (
      <div
        ref={this.bindRef}
        className={styles.listview}
        onScroll={this.onHandleScroll}
      >
        {renderList(list)}
        {this.renderLoadingHint()}
      </div>
    );
  }
}
