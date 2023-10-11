import * as zlib from 'zlib';

export class Compressor {
  public static async compressString(input: string): Promise<string> {
    return new Promise((resolve, reject) => {
      zlib.deflate(input, (err, buffer) => {
        if (err) {
          reject(err);
          return;
        }
        // Convert the buffer to a Base64 string
        resolve(buffer.toString('base64'));
      });
    });
  }

  public static async decompressString(compressed: string) {
    return new Promise((resolve, reject) => {
      // Convert the base64 string back to a buffer
      const buffer = Buffer.from(compressed, 'base64');

      zlib.inflate(buffer, (err, decompressedBuffer) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(decompressedBuffer.toString());
      });
    });
  }

  // // Using the function
  // decompressString(/* your compressed string */)
  //   .then(original => {
  //     console.log("Original String:", original);
  //   })
  //   .catch(err => {
  //     console.error("Decompression Error:", err);
  //   });

  // const data = "Your string data here";
  // compressString(data)
  //   .then(compressed => {
  //     console.log("Compressed String:", compressed);
  //   })
  //   .catch(err => {
  //     console.error("Compression Error:", err);
  //   });
}
