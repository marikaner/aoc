import { readInput } from '../read-input';

async function getInput(): Promise<string> {
  return await readInput(__dirname);
}

interface Header {
  version: number;
  type: number;
}

interface OperationParsingInfo {
  lengthType: string;
  length: number;
  startIndex: number;
}

enum Operation {
  Sum = 0,
  Product = 1,
  Minimum = 2,
  Maximum = 3,
  GreaterThan = 5,
  LessThan = 6,
  EqualTo = 7
}

interface NumPacket {
  value: number;
}

interface OperationPacket {
  operation: Operation;
  subPackets: Packet[];
}

type Packet = (NumPacket | OperationPacket) & { version: number };

function isLiteralNumberType(type: number): boolean {
  return type === 4;
}

function sumVersions(packet: Packet): number {
  if ('value' in packet) {
    return packet.version;
  }
  return (
    packet.version +
    packet.subPackets.reduce(
      (sum, subPacket) => sum + sumVersions(subPacket),
      0
    )
  );
}

function calculate(packet: Packet): number {
  if ('value' in packet) {
    return packet.value;
  }
  const subPacketValues = packet.subPackets.map((subPacket) =>
    calculate(subPacket)
  );
  switch (packet.operation) {
    case Operation.Sum:
      return subPacketValues.reduce((sum, val) => sum + val, 0);
    case Operation.Product:
      return subPacketValues.reduce((product, val) => product * val, 1);
    case Operation.Minimum:
      return Math.min(...subPacketValues);
    case Operation.Maximum:
      return Math.max(...subPacketValues);
    case Operation.GreaterThan:
      return subPacketValues[0] > subPacketValues[1] ? 1 : 0;
    case Operation.LessThan:
      return subPacketValues[0] < subPacketValues[1] ? 1 : 0;
    case Operation.EqualTo:
      return subPacketValues[0] === subPacketValues[1] ? 1 : 0;
  }
}

class Parser {
  private message: string;
  private index: number;

  constructor(hexaRep: string) {
    this.message = this.transposeMessage(hexaRep);
    this.index = 0;
  }

  private transposeMessage(hexaRep: string): string {
    return hexaRep
      .split('')
      .map((digit) => parseInt(digit, 16).toString(2).padStart(4, '0'))
      .join('');
  }

  parsePacket(): Packet {
    const { version, type } = this.parseHeader();
    const packet = isLiteralNumberType(type)
      ? this.parseNumPacket()
      : this.parseOperation(type);
    return { version, ...packet };
  }

  parseHeader(): Header {
    const header = {
      version: parseInt(this.message.substring(this.index, this.index + 3), 2),
      type: parseInt(this.message.substring(this.index + 3, this.index + 6), 2)
    };
    this.index += 6;
    return header;
  }

  parseNumPacket(): NumPacket {
    let binNum = '';
    let end = false;
    const chunkLength = 5;

    while (!end) {
      end = this.message.substring(this.index, this.index + 1) === '0';
      binNum += this.message.substring(
        this.index + 1,
        this.index + chunkLength
      );
      this.index += chunkLength;
    }

    return { value: parseInt(binNum, 2) };
  }

  parseOperationParsingInfo(): OperationParsingInfo {
    const lengthType = this.message.substring(this.index, this.index + 1);
    this.index++;
    const lengthBits = lengthType === '0' ? 15 : 11;
    const length = parseInt(
      this.message.substring(this.index, this.index + lengthBits),
      2
    );
    this.index += lengthBits;
    return {
      length,
      lengthType,
      startIndex: this.index
    };
  }

  parseOperation(operation: Operation): OperationPacket {
    const operationInfo = this.parseOperationParsingInfo();
    const { lengthType, length, startIndex } = operationInfo;
    const subPackets = [];
    if (lengthType === '0') {
      while (startIndex + length - this.index >= 4) {
        subPackets.push(this.parsePacket());
      }
    }
    if (lengthType === '1') {
      for (let i = 0; i < length; i++) {
        subPackets.push(this.parsePacket());
      }
    }
    return { operation, subPackets };
  }
}

async function main() {
  const hexaRep = await getInput();
  const parser = new Parser(hexaRep);
  const packet = parser.parsePacket();

  /* Task 1 */
  console.log(sumVersions(packet));

  /* Task 2 */
  console.log(calculate(packet));
}

main();
