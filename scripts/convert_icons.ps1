Add-Type -AssemblyName System.Drawing

$jpgPath = "c:\Users\john\Documents\Projetos\meuTarot\mobile\assets\playstore\icon_512x512.jpg"
$img = [System.Drawing.Image]::FromFile($jpgPath)

Write-Host "Input image dimensions: $($img.Width)x$($img.Height)"

# 1. Base icon.png (1024x1024 PNG)
$img.Save("c:\Users\john\Documents\Projetos\meuTarot\assets\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img.Save("c:\Users\john\Documents\Projetos\meuTarot\mobile\assets\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Updated icon.png in root and mobile."

# 2. Android adaptive icon foreground (1024x1024 PNG)
# The full image can be used directly as foreground
$img.Save("c:\Users\john\Documents\Projetos\meuTarot\assets\android-icon-foreground.png", [System.Drawing.Imaging.ImageFormat]::Png)
$img.Save("c:\Users\john\Documents\Projetos\meuTarot\mobile\assets\android-icon-foreground.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Updated android-icon-foreground.png in root and mobile."

# 3. Favicon (48x48 PNG)
$favicon = New-Object System.Drawing.Bitmap(48, 48)
$g = [System.Drawing.Graphics]::FromImage($favicon)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, 48, 48)
$g.Dispose()
$favicon.Save("c:\Users\john\Documents\Projetos\meuTarot\assets\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$favicon.Save("c:\Users\john\Documents\Projetos\meuTarot\mobile\assets\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$favicon.Dispose()
Write-Host "Updated favicon.png in root and mobile."

$img.Dispose()
Write-Host "All icons converted and updated successfully!"
