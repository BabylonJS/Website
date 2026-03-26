using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace BabylonJS
{
    /// <summary>
    /// Summary description for Handler1
    /// </summary>
    public class ImageProxy : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            //pass on request to tile server
            string targetUrl = context.Request.Params["imagesrc"];

            System.Net.WebRequest myRequest = System.Net.WebRequest.Create(targetUrl);
            System.Net.WebResponse myResponse = myRequest.GetResponse();

            Bitmap myImage = new Bitmap(Image.FromStream(myResponse.GetResponseStream()));
            //context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Response.ContentType = "image/jpeg";
            WritePngToStream(myImage, context.Response.OutputStream);
        }

        void WritePngToStream(Bitmap image, Stream outStream)
        {
            MemoryStream writeStream = new MemoryStream();
            image.Save(outStream, System.Drawing.Imaging.ImageFormat.Png);
            writeStream.WriteTo(outStream);
            image.Dispose();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}