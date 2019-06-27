/**
 * @class ListView
 */

import * as React from 'react';

import styles from './styles.css';

export type Props = {
  /**
   * 滚动到底部距离限制 -> 触发加载
   */
  threshhold?: number;
  /**
   * 容器高度
   */
  containerHeight?: number;
  /**
   * 是否还有更多数据
   */
  hasMore: boolean;
  /**
   * 列表数据
   */
  list: Array<any>;
  /**
   * 渲染Item
   */
  renderItem: (item: any, index: number) => any;
  /**
   * 加载更多数据
   */
  loadMore: Function;
  /**
   * 加载数据的提示
   */
  loadingHint?: JSX.Element;
  /**
   * 无更多数据的提示
   */
  noDataHint?: JSX.Element;
};

export type State = {
  /**
   * 滚动距容器底部的距离
   */
  scrollBottomDistance: number;
  /**
   * 是否处于加载状态
   */
  loading: boolean;
};

export default class ListView extends React.Component<Props, State> {
  state: State = {
    scrollBottomDistance: Number.POSITIVE_INFINITY,
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
        loading: true,
      };
    });
  };

  finishLoading = () => {
    this.setState(() => {
      return {
        loading: false,
      };
    });
  };

  async componentDidMount() {
    const { loadMore, containerHeight } = this.props;
    this.startLoading();
    try {
      await loadMore();
    } catch (err) {
      console.error(err);
    }
    if (containerHeight && containerHeight < this.containerRef.clientHeight) {
      this.containerRef.style.height = `${containerHeight}px`;
      return;
    }
    this.containerRef.style.height =
      (this.containerRef.clientHeight - 50).toString() + 'px';
    this.finishLoading();
  }

  /**
   * 节流函数
   */
  throttle = (method: Function, time: number, context: any) => {
    var startTime: Date = new Date();
    return function() {
      const endTime: Date = new Date();
      const resTime: number =
        endTime.getMilliseconds() - startTime.getMilliseconds();
      if (resTime >= time) {
        method.call(context);
        startTime = endTime;
      }
    };
  };
  /**
   * 容器滚动监听函数
   */
  onHandleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    // 如果正在加载,则直接返回
    if (this.state.loading || !this.props.hasMore) return;
    e.persist();
    const {
      currentTarget: { clientHeight, scrollHeight, scrollTop },
    } = e;
    const { threshhold, loadMore } = this.props;
    if (scrollTop + clientHeight >= scrollHeight + (threshhold || 0)) {
      this.startLoading();
      await loadMore();
      this.finishLoading();
    }
  };

  /**
   * 渲染加载提示
   */
  renderLoadingHint = () => {
    const { hasMore, loadingHint, noDataHint } = this.props;
    const { loading } = this.state;
    return (
      <div className={styles.loadingHint}>
        {
          (hasMore && loading) ?
            (
              !!loadingHint ?
                loadingHint :
                <div>正在为您努力加载...</div>
            ) :
            null
        }
        {
          !hasMore ?
            (
              !!noDataHint ?
                noDataHint :
                <div>暂无更多数据</div>
            ) :
            null
        }
      </div>
    );
  };

  render() {
    const { renderItem, list } = this.props;
    return (
      <div
        ref={this.bindRef}
        className={styles.listview}
        onScroll={this.onHandleScroll}
      >
        {list && list.length > 0 ? <div>{list.map(renderItem)}</div> : null}
        {this.renderLoadingHint()}
      </div>
    );
  }
}
