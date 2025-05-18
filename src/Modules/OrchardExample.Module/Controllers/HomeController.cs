using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace OrchardExample.Module.Controllers;

public sealed class HomeController : Controller
{
    [Route("/")]
    public ActionResult Index()
    {
        return View();
    }
}
