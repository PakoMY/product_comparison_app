import React, {useMemo, useState, useRef, useCallback} from 'react';
import {View, Text, ScrollView, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FundNameBar} from '../components/FundNameBar';
import {CompareSectionTabs} from '../components/CompareSectionTabs';
import {Tabs} from '../components/Tabs';
import {PerformanceChart} from '../components/PerformanceChart';
import {ChartLegend} from '../components/ChartLegend';
import {HorizontalTable} from '../components/HorizontalTable';
import {useFundStore} from '../store/useFundStore';
import {colors} from '../constants/colors';
import {formatPercent, formatSignedPercent, formatYi, formatInt} from '../utils/format';
import {alignNavSeries, fundRatingToStars} from '../utils/chartHelper';
import {useHorizontalScrollSync} from '../hooks/useHorizontalScrollSync';

const SECTIONS = [
  {key: 'overview', label: '信息速览'},
  {key: 'trend', label: '收益走势'},
  {key: 'performance', label: '业绩表现'},
  {key: 'profit', label: '盈利概率'},
  {key: 'risk', label: '风险数据'},
  {key: 'hold', label: '持仓信息'},
  {key: 'manager', label: '基金经理'},
  {key: 'company', label: '基金公司'},
  {key: 'hot', label: '基金热度'},
  {key: 'trade', label: '交易信息'},
];

const PERIOD_TABS = [
  {key: 'month1', label: '近1月'},
  {key: 'month3', label: '近3月'},
  {key: 'month6', label: '近6月'},
  {key: 'year1', label: '近1年'},
];

const PALETTE = ['#FF6A3D', '#2563EB', '#16A34A', '#CA8A04', '#9333EA'];

/** 名称栏 + 9 个表格（已去掉收益走势内「收益率对比」表） */
const H_COUNT = 10;

export function CompareScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const getSelectedFunds = useFundStore(s => s.getSelectedFunds);
  const funds = getSelectedFunds();
  const [period, setPeriod] = useState('year1');
  const [activeSection, setActiveSection] = useState(0);
  const mainScrollRef = useRef(null);
  const sectionY = useRef(Array(SECTIONS.length).fill(0));
  const suppressTabSpyUntil = useRef(0);
  const tabSpyTimer = useRef(null);
  const {refs: hRefs, onScrollFrom} = useHorizontalScrollSync(H_COUNT);

  const columnTitles = useMemo(
    () => funds.map(f => (f.name.length > 10 ? `${f.name.slice(0, 10)}…` : f.name)),
    [funds],
  );

  const chartSeries = useMemo(() => {
    const raw = funds.map((f, i) => ({
      key: f.id,
      color: PALETTE[i % PALETTE.length],
      data: f.nav?.[period] || [],
    }));
    return alignNavSeries(raw);
  }, [funds, period]);

  const overviewRows = useMemo(
    () => [
      {label: '成立时间', values: funds.map(f => f.inceptionDate ?? '—')},
      {label: '基金规模', values: funds.map(f => (f.scale != null ? `${f.scale.toFixed(1)} 亿` : '—'))},
      {label: '投资风格', values: funds.map(f => f.investStyle ?? '—')},
      {label: '风险等级', values: funds.map(f => f.riskLevel ?? '—')},
      {label: '基金评级', values: funds.map(f => fundRatingToStars(f.fundRating))},
    ],
    [funds],
  );

  const perfRows = useMemo(
    () => [
      {label: '近1月', values: funds.map(f => formatSignedPercent(f.performance.month1))},
      {label: '近3月', values: funds.map(f => formatSignedPercent(f.performance.month3))},
      {label: '近6月', values: funds.map(f => formatSignedPercent(f.performance.month6))},
      {label: '近1年', values: funds.map(f => formatSignedPercent(f.performance.year1))},
      {label: '近1月同类排名', values: funds.map(f => f.performanceRank.month1)},
      {label: '近3月同类排名', values: funds.map(f => f.performanceRank.month3)},
      {label: '近6月同类排名', values: funds.map(f => f.performanceRank.month6)},
      {label: '近1年同类排名', values: funds.map(f => f.performanceRank.year1)},
    ],
    [funds],
  );

  const probRows = useMemo(
    () => [
      {label: '持有3月盈利概率', values: funds.map(f => formatPercent(f.profitProb.hold3m))},
      {label: '持有6月盈利概率', values: funds.map(f => formatPercent(f.profitProb.hold6m))},
      {label: '持有1年盈利概率', values: funds.map(f => formatPercent(f.profitProb.hold1y))},
    ],
    [funds],
  );

  const riskRows = useMemo(
    () => [
      {label: '最大回撤', values: funds.map(f => formatSignedPercent(f.risk.maxDrawdown))},
      {label: '夏普比率', values: funds.map(f => f.risk.sharpe.toFixed(2))},
      {label: '年化波动', values: funds.map(f => formatPercent(f.risk.volatility))},
    ],
    [funds],
  );

  const portRows = useMemo(
    () => [
      {label: '股票', values: funds.map(f => formatPercent(f.portfolio.stock))},
      {label: '债券', values: funds.map(f => formatPercent(f.portfolio.bond))},
      {label: '现金及其他', values: funds.map(f => formatPercent(f.portfolio.cash))},
    ],
    [funds],
  );

  const mgrRows = useMemo(
    () => [
      {label: '经理', values: funds.map(f => f.manager.name)},
      {label: '综合得分', values: funds.map(f => String(f.manager.score))},
      {label: '管理规模(亿)', values: funds.map(f => f.manager.manageScale.toFixed(0))},
      {label: '年化回报', values: funds.map(f => formatSignedPercent(f.manager.annualReturn))},
      {label: '任期回报(倍)', values: funds.map(f => f.manager.tenureReturn.toFixed(2))},
    ],
    [funds],
  );

  const companyRows = useMemo(
    () => [
      {label: '公司', values: funds.map(f => f.company.name)},
      {label: '规模(亿)', values: funds.map(f => formatYi(f.company.scale, 0))},
      {label: '基金数量', values: funds.map(f => String(f.company.fundCount))},
      {label: '成立日期', values: funds.map(f => f.company.inception)},
    ],
    [funds],
  );

  const hotRows = useMemo(
    () => [
      {label: '访问量', values: funds.map(f => formatInt(f.hot.visits))},
      {label: '关注人数', values: funds.map(f => formatInt(f.hot.follows))},
      {label: '购买人数', values: funds.map(f => formatInt(f.hot.purchases))},
      {label: '定投人数', values: funds.map(f => formatInt(f.hot.autoInvest))},
    ],
    [funds],
  );

  const tradeRows = useMemo(
    () => [
      {label: '交易状态', values: funds.map(f => f.trade.status)},
      {label: '申购费率', values: funds.map(f => formatPercent(f.trade.fee))},
    ],
    [funds],
  );

  const onSectionLayout = useCallback(index => {
    return e => {
      sectionY.current[index] = e.nativeEvent.layout.y;
    };
  }, []);

  const scrollToSection = useCallback(index => {
    setActiveSection(index);
    suppressTabSpyUntil.current = Date.now() + 500;
    const y = sectionY.current[index] ?? 0;
    mainScrollRef.current?.scrollTo({y: Math.max(0, y - 8), animated: true});
  }, []);

  const onMainScroll = useCallback(e => {
    if (Date.now() < suppressTabSpyUntil.current) {
      return;
    }
    const scrollY = e.nativeEvent.contentOffset.y;
    if (tabSpyTimer.current) {
      clearTimeout(tabSpyTimer.current);
    }
    tabSpyTimer.current = setTimeout(() => {
      const ys = sectionY.current;
      const anchor = scrollY + 72;
      let next = 0;
      for (let i = ys.length - 1; i >= 0; i--) {
        if (anchor >= ys[i]) {
          next = i;
          break;
        }
      }
      setActiveSection(prev => (prev === next ? prev : next));
    }, 100);
  }, []);

  if (!funds.length) {
    return (
      <View style={[styles.empty, {paddingTop: insets.top + 24}]}>
        <Text style={styles.emptyText}>未选择基金，请返回列表选择</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>返回</Text>
        </Pressable>
      </View>
    );
  }

  const navByFund = useCallback(f => f.nav?.[period] || [], [period]);

  return (
    <View style={[styles.root, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backHit}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>对比详情</Text>
        <View style={styles.headerRight} />
      </View>
      <CompareSectionTabs sections={SECTIONS} activeIndex={activeSection} onSelect={scrollToSection} />
      <FundNameBar ref={hRefs[0]} funds={funds} onScroll={onScrollFrom(0)} />
      <ScrollView
        ref={mainScrollRef}
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onMainScroll}
        scrollEventThrottle={16}>
        <View onLayout={onSectionLayout(0)}>
          <HorizontalTable
            ref={hRefs[1]}
            title="信息速览"
            rows={overviewRows}
            columnTitles={columnTitles}
            onScroll={onScrollFrom(1)}
            hideMetricHeader
          />
        </View>
        <View onLayout={onSectionLayout(1)}>
          <Text style={styles.sectionTitle}>收益走势</Text>
          <Tabs options={PERIOD_TABS} value={period} onChange={setPeriod} />
          <ChartLegend funds={funds} navByFund={navByFund} period={period} palette={PALETTE} />
          <PerformanceChart series={chartSeries} period={period} />
        </View>
        <View onLayout={onSectionLayout(2)}>
          <HorizontalTable
            ref={hRefs[2]}
            title="业绩表现"
            rows={perfRows}
            columnTitles={columnTitles}
            onScroll={onScrollFrom(2)}
            hideMetricHeader
          />
        </View>
        <View onLayout={onSectionLayout(3)}>
          <HorizontalTable
            ref={hRefs[3]}
            title="盈利概率"
            rows={probRows}
            columnTitles={columnTitles}
            onScroll={onScrollFrom(3)}
            hideMetricHeader
          />
        </View>
        <View onLayout={onSectionLayout(4)}>
          <HorizontalTable
            ref={hRefs[4]}
            title="风险数据"
            rows={riskRows}
            columnTitles={columnTitles}
            onScroll={onScrollFrom(4)}
          />
        </View>
        <View onLayout={onSectionLayout(5)}>
          <HorizontalTable
            ref={hRefs[5]}
            title="持仓信息"
            rows={portRows}
            columnTitles={columnTitles}
            onScroll={onScrollFrom(5)}
            hideMetricHeader
          />
        </View>
        <View onLayout={onSectionLayout(6)}>
          <HorizontalTable
            ref={hRefs[6]}
            title="基金经理"
            rows={mgrRows}
            columnTitles={columnTitles}
            onScroll={onScrollFrom(6)}
            hideMetricHeader
          />
        </View>
        <View onLayout={onSectionLayout(7)}>
          <HorizontalTable
            ref={hRefs[7]}
            title="基金公司"
            rows={companyRows}
            columnTitles={columnTitles}
            onScroll={onScrollFrom(7)}
            hideMetricHeader
          />
        </View>
        <View onLayout={onSectionLayout(8)}>
          <HorizontalTable
            ref={hRefs[8]}
            title="基金热度"
            rows={hotRows}
            columnTitles={columnTitles}
            onScroll={onScrollFrom(8)}
            hideMetricHeader
          />
        </View>
        <View onLayout={onSectionLayout(9)}>
          <HorizontalTable
            ref={hRefs[9]}
            title="交易信息"
            rows={tradeRows}
            columnTitles={columnTitles}
            onScroll={onScrollFrom(9)}
            hideMetricHeader
          />
        </View>
        <View style={{height: insets.bottom + 24}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.bg},
  mainScroll: {flex: 1},
  scrollContent: {paddingTop: 4, paddingBottom: 8},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  backHit: {width: 44, height: 44, justifyContent: 'center', alignItems: 'center'},
  backArrow: {fontSize: 32, color: colors.text, marginTop: -4},
  headerTitle: {flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.text},
  headerRight: {width: 44},
  empty: {flex: 1, backgroundColor: colors.bg, alignItems: 'center', paddingHorizontal: 24},
  emptyText: {fontSize: 15, color: colors.subtext, textAlign: 'center'},
  backBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backBtnText: {color: '#fff', fontWeight: '700'},
});
