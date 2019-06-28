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
   * 是否处于加载状态
   */
  loading: boolean;
};

export default class ListView extends React.Component<Props, State> {
  state: State = {
    loading: false,
  };

  containerRef: HTMLDivElement;

  bindRef = (ref: HTMLDivElement | null) => {
    ref && (this.containerRef = ref);
  };

  startLoading = () => this.setState({ loading: true });

  finishLoading = () => this.setState({ loading: false });

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
    } else {
      this.containerRef.style.height =
        (this.containerRef.clientHeight - 1).toString() + 'px';
    }
    this.finishLoading();
  }

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
    if (scrollTop + clientHeight >= scrollHeight - (threshhold || 100)) {
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
        {hasMore && loading ? (
          !!loadingHint ? (
            loadingHint
          ) : (
            <div>正在为您努力加载...</div>
          )
        ) : null}
        {!hasMore ? !!noDataHint ? noDataHint : <div>暂无更多数据</div> : null}
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
        {list && list.length > 0 ? <>{list.map(renderItem)}</> : null}
        {this.renderLoadingHint()}
      </div>
    );
  }
}
