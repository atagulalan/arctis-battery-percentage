@if (@X)==(@Y) @end /* JScript comment
@echo off

setlocal
del /q /f %~n0.exe >nul 2>&1
for /f "tokens=* delims=" %%v in ('dir /b /s /a:-d  /o:-n "%SystemRoot%\Microsoft.NET\Framework\*jsc.exe"') do (
   set "jsc=%%v"
)

if not exist "%~n0.exe" (
    "%jsc%" /nologo /out:"%~n0.exe" "%~dpsfnx0"
)

if exist "%~n0.exe" ( 
    invisible.vbs "%~n0.exe" %* 
)


endlocal & exit /b %errorlevel%

end of jscript comment*/

import System;
import System.Windows;
import System.Windows.Forms;
import System.Drawing;
import System.Drawing.SystemIcons;
import System.Diagnostics;

var timer1;
var notification;

main()


function update(){
    //System.Console.WriteLine("Updating...");
    var willChange = exec().Trim();
    notification.Text = "Steelseries Arctis Battery Percentage ("+willChange+"%)"
    notification.Icon = new Icon("icons/"+willChange+".ico");
    System.Threading.Thread.Sleep(120000);
    update();
}

function exec(){
    var p = new Process();
    p.StartInfo.UseShellExecute = false;
    p.StartInfo.RedirectStandardOutput = true;
    p.StartInfo.FileName = "getPercentage.bat";
    p.Start();
    var output = p.StandardOutput.ReadToEnd();
    p.WaitForExit();
    return output; 
}



function main(){
    notification = new System.Windows.Forms.NotifyIcon();
    notification.Visible = true;

    update();

    return 0;
}