import React from 'react'
import _ from 'lodash'
import padStart from 'lodash.padstart'
import { Text } from '../../../components'
import {
  white,
  mutedWhite,
  softLighten,
  brightRed,
} from '../../../components/style/color'
import prettyBytes from 'pretty-bytes'

export const FileListViz = ({ files = [] }) => {
  const largestFile = _(files)
    .map('size')
    .max()
  const largestPrevFile = _(files)
    .map('prevSize')
    .max()
  return (
    <div>
      {files.map(({ fileName, size, prevSize }, i) => (
        <div key={fileName} style={{ marginBottom: 2 }}>
          <FileVizItem
            fileName={fileName}
            size={size}
            prevSize={prevSize}
            number={i + 1}
            largestGraphSize={Math.max(largestFile, largestPrevFile)}
          />
        </div>
      ))}
    </div>
  )
}

const CompareFileSizeGraph = ({
  primary,
  secondary,
  max = Math.max(primary, secondary),
}) => {
  const style = {
    graph: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    primaryBar: {
      height: 4,
      background: primary <= secondary ? white : brightRed,
      width: `${primary / max * 100}%`,
    },
    secondaryBar: {
      marginTop: 4,
      height: 2,
      background: mutedWhite,
      width: `${secondary / max * 100}%`,
    },
  }
  return (
    <div style={style.graph}>
      <div style={style.primaryBar} />
      <div style={style.secondaryBar} />
    </div>
  )
}

const SizeChangePercent = ({ size, prevSize }) => {
  const change = (size - prevSize) / prevSize * 100
  const increased = change > 0

  const symbol = increased ? '↗' : change < 0 ? '↘' : '-'

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Text
        size={2.4}
        color={increased ? brightRed : white}
        weight={increased ? 600 : 400}
      >
        {symbol}
      </Text>
      <Text size={1} color={mutedWhite} weight={400}>{`${change}%`}</Text>
    </div>
  )
}

const SplitFileSize = ({ size }) => {
  const [smallSize, sizeLabel] = prettyBytes(size).split(' ')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <Text size={2} weight={400}>
        {smallSize}
      </Text>

      <span style={{ marginLeft: 4, marginBottom: 2 }}>
        <Text size={1} capitalize={true}>
          {sizeLabel}
        </Text>
      </span>
    </div>
  )
}

const FileVizItem = ({
  fileName,
  size,
  prevSize,
  number,
  largestGraphSize,
}) => {
  const styles = {
    item: {
      display: 'flex',
    },
    number: {
      backgroundColor: mutedWhite,
      width: 50,
      height: 50,
      marginRight: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    file: {
      backgroundColor: softLighten,
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
    },
    arrow: {
      width: 50,
      height: 50,
    },
    graph: {
      flex: 1,
      paddingRight: 15,
      display: 'flex',
    },
    size: {
      minWidth: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    decoration: {
      width: 10,
      borderRight: `1px solid ${mutedWhite}`,
      borderTop: `1px solid ${mutedWhite}`,
      height: 10,
    },
  }

  return (
    <div style={styles.item}>
      <div style={styles.number}>
        <Text size={2} weight={400}>
          {padStart(number, 2, '0')}
        </Text>
      </div>

      <div style={styles.file}>
        <Text size={2} capitalize={true}>
          {fileName}
        </Text>
      </div>

      <div style={styles.arrow}>
        <SizeChangePercent size={size} prevSize={prevSize} />
      </div>

      <div style={styles.graph}>
        <CompareFileSizeGraph
          primary={size}
          secondary={prevSize}
          max={largestGraphSize}
        />
      </div>

      <div style={styles.size}>
        <SplitFileSize size={size} />
      </div>

      <div style={styles.decoration} />
    </div>
  )
}
