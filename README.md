
# 설치

```ps
pnpm install
```

<br><br>

# 실행

```ps
pnpm start
```


<br>
<hr>
<br>


# motion: Ready

```json
{"dataType":"SENSOR","param":[{"id":"motion","desc":"동작","value":"Ready"},{"id":"sensor1","desc":"1번 센서","value":10},{"id":"sensor2","desc":"2번 센서","value":20}]}
```

```sh
packetLength: 185 / jsonBytes.length: 177 / crc16: 40766
```

```
0A 55 B9 00 00 00 7B 22 64 61 74 61 54 79 70 65 22 3A 22 53 45 4E 53 4F 52 22 2C 22 70 61 72 61 6D 22 3A 5B 7B 22 69 64 22 3A 22 6D 6F 74 69 6F 6E 22 2C 22 64 65 73 63 22 3A 22 EB 8F 99 EC 9E 91 22 2C 22 76 61 6C 75 65 22 3A 22 52 65 61 64 79 22 7D 2C 7B 22 69 64 22 3A 22 73 65 6E 73 6F 72 31 22 2C 22 64 65 73 63 22 3A 22 31 EB B2 88 20 EC 84 BC EC 84 9C 22 2C 22 76 61 6C 75 65 22 3A 31 30 7D 2C 7B 22 69 64 22 3A 22 73 65 6E 73 6F 72 32 22 2C 22 64 65 73 63 22 3A 22 32 EB B2 88 20 EC 84 BC EC 84 9C 22 2C 22 76 61 6C 75 65 22 3A 32 30 7D 5D 7D 3E 9F
```

<br>

# motion: Move
```json
{"dataType":"SENSOR","param":[{"id":"motion","desc":"동작","value":"Move"},{"id":"sensor1","desc":"1번 센서","value":10},{"id":"sensor2","desc":"2번 센서","value":20}]}
```

```
packetLength: 184 / jsonBytes.length: 176 / crc16: 15662
```

```
0A 55 B8 00 00 00 7B 22 64 61 74 61 54 79 70 65 22 3A 22 53 45 4E 53 4F 52 22 2C 22 70 61 72 61 6D 22 3A 5B 7B 22 69 64 22 3A 22 6D 6F 74 69 6F 6E 22 2C 22 64 65 73 63 22 3A 22 EB 8F 99 EC 9E 91 22 2C 22 76 61 6C 75 65 22 3A 22 4D 6F 76 65 22 7D 2C 7B 22 69 64 22 3A 22 73 65 6E 73 6F 72 31 22 2C 22 64 65 73 63 22 3A 22 31 EB B2 88 20 EC 84 BC EC 84 9C 22 2C 22 76 61 6C 75 65 22 3A 31 30 7D 2C 7B 22 69 64 22 3A 22 73 65 6E 73 6F 72 32 22 2C 22 64 65 73 63 22 3A 22 32 EB B2 88 20 EC 84 BC EC 84 9C 22 2C 22 76 61 6C 75 65 22 3A 32 30 7D 5D 7D 2E 3D
```