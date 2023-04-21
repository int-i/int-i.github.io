---
title: "Conversion error: Jekyll::Converters::Scss encountered an error while converting '.scss'"
date: 2023-04-21
author: Astro36
category: web
tags: [web, github, jekyll, html, css, scss]
thumbnail: /assets/posts/2023-04-21-jekyll-scss-error/thumbnail.jpg
---

Jekyll 최신 버전을 Windows **로컬**에 설치해 페이지를 **빌드**하려하면, `Jekyll::Converters::Scss encountered an error` **오류**가 발생하는 경우가 있습니다.

```txt
> jekyll s
Configuration file: C:/Users/PSJ/Projects/int-i.github.io/_config.yml
            Source: C:/Users/PSJ/Projects/int-i.github.io
       Destination: C:/Users/PSJ/Projects/int-i.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
       Jekyll Feed: Generating feed for posts
Error: expected "{".
  ╷
6 │ @import 'main';
  │               ^
  ╵
  C:\Users\PSJ\Projects\int-i.github.io\assets\css\main.scss 6:15  @import
  C:\Users\PSJ\Projects\int-i.github.io\assets\css\main.scss 1:9   root stylesheet 
  Conversion error: Jekyll::Converters::Scss encountered an error while converting 'assets/css/main.scss':
                    expected "{".
                    ------------------------------------------------
      Jekyll 4.3.2   Please append `--trace` to the `serve` command 
                     for any additional information or backtrace. 
                    ------------------------------------------------
C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-sass-converter-3.0.0/lib/jekyll/converters/scss.rb:175:in `rescue in convert': expected "{". (Jekyll::Converters::Scss::SyntaxError)
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-sass-converter-3.0.0/lib/jekyll/converters/scss.rb:159:in `convert'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:105:in `block in convert'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:104:in `each'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:104:in `reduce'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:104:in `convert'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:84:in `render_document'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:63:in `run'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:572:in `render_regenerated'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:564:in `block in render_pages'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:563:in `each'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:563:in `render_pages'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:211:in `render'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:80:in `process'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/command.rb:28:in `process_site'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/commands/build.rb:65:in `build'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/commands/build.rb:36:in `process'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/command.rb:91:in `block in process_with_graceful_fail'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/command.rb:91:in `each'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/command.rb:91:in `process_with_graceful_fail'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/commands/serve.rb:86:in `block (2 levels) in init_with_program'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/mercenary-0.4.0/lib/mercenary/command.rb:221:in `block in execute'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/mercenary-0.4.0/lib/mercenary/command.rb:221:in `each'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/mercenary-0.4.0/lib/mercenary/command.rb:221:in `execute'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/mercenary-0.4.0/lib/mercenary/program.rb:44:in `go'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/mercenary-0.4.0/lib/mercenary.rb:21:in `program'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/exe/jekyll:15:in `<top (required)>'
        from C:/Users/PSJ/scoop/apps/ruby/current/gems/bin/jekyll:32:in `load'
        from C:/Users/PSJ/scoop/apps/ruby/current/gems/bin/jekyll:32:in `<main>'
C:/Users/PSJ/scoop/persist/ruby/gems/gems/sass-embedded-1.59.3-x64-mingw-ucrt/lib/sass/embedded/protofier.rb:16:in `from_proto_compile_response': expected "{". (Sass::CompileError)
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/sass-embedded-1.59.3-x64-mingw-ucrt/lib/sass/embedded/host.rb:66:in `compile_request'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/sass-embedded-1.59.3-x64-mingw-ucrt/lib/sass/embedded.rb:216:in `compile_string'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/sass-embedded-1.59.3-x64-mingw-ucrt/lib/sass/embedded.rb:53:in `compile_string'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-sass-converter-3.0.0/lib/jekyll/converters/scss.rb:160:in `convert'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:105:in `block in convert'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:104:in `each'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:104:in `reduce'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:104:in `convert'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:84:in `render_document'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/renderer.rb:63:in `run'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:572:in `render_regenerated'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:564:in `block in render_pages'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:563:in `each'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:563:in `render_pages'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:211:in `render'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/site.rb:80:in `process'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/command.rb:28:in `process_site'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/commands/build.rb:65:in `build'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/commands/build.rb:36:in `process'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/command.rb:91:in `block in process_with_graceful_fail'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/command.rb:91:in `each'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/command.rb:91:in `process_with_graceful_fail'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/lib/jekyll/commands/serve.rb:86:in `block (2 levels) in init_with_program'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/mercenary-0.4.0/lib/mercenary/command.rb:221:in `block in execute'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/mercenary-0.4.0/lib/mercenary/command.rb:221:in `each'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/mercenary-0.4.0/lib/mercenary/command.rb:221:in `execute'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/mercenary-0.4.0/lib/mercenary/program.rb:44:in `go'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/mercenary-0.4.0/lib/mercenary.rb:21:in `program'
        from C:/Users/PSJ/scoop/persist/ruby/gems/gems/jekyll-4.3.2/exe/jekyll:15:in `<top (required)>'
        from C:/Users/PSJ/scoop/apps/ruby/current/gems/bin/jekyll:32:in `load'
        from C:/Users/PSJ/scoop/apps/ruby/current/gems/bin/jekyll:32:in `<main>'
```

관련된 많은 글을 찾아보며 SCSS 파일을 수정해 보았지만 해결되지 않았고, **Jekyll 버전**에 문제가 있을 것이라 추측하여 GitHub Pages의 Jekyll 버전으로 **다운그레이드**했습니다.

[GitHub Pages: Dependency versions](https://pages.github.com/versions/)

- `jekyll`: v3.9.3
- `jekyll-feed`: v0.15.1
- `jekyll-paginate`: v1.1.0

먼저, 기존에 설치된 **Jekyll을 삭제**해야 합니다.

```txt
> gem uninstall jekyll

You have requested to uninstall the gem:
        jekyll-4.3.2

jekyll-feed-0.17.0 depends on jekyll (>= 3.7, < 5.0)
jekyll-sitemap-1.4.0 depends on jekyll (>= 3.7, < 5.0)
If you remove this gem, these dependencies will not be met.
Continue with Uninstall? [yN]  y
Remove executables:
        jekyll

in addition to the gem? [Yn]  y
Removing jekyll
Successfully uninstalled jekyll-4.3.2
```

`jekyll` v3.9.3로 새로 **설치**합니다.

```txt
> gem install jekyll -v 3.9.3   
Fetching jekyll-3.9.3.gem
Fetching rouge-3.30.0.gem
Fetching mercenary-0.3.6.gem
Fetching sass-listen-4.0.0.gem
Fetching sass-3.7.4.gem
Fetching jekyll-sass-converter-1.5.2.gem
Successfully installed rouge-3.30.0
Successfully installed mercenary-0.3.6
Successfully installed sass-listen-4.0.0

Ruby Sass has reached end-of-life and should no longer be used.

* If you use Sass as a command-line tool, we recommend using Dart Sass, the new
  primary implementation: https://sass-lang.com/install

* If you use Sass as a plug-in for a Ruby web framework, we recommend using the
  sassc gem: https://github.com/sass/sassc-ruby#readme

* For more details, please refer to the Sass blog:
  https://sass-lang.com/blog/posts/7828841

Successfully installed sass-3.7.4
Successfully installed jekyll-sass-converter-1.5.2
Successfully installed jekyll-3.9.3
Parsing documentation for rouge-3.30.0
Installing ri documentation for rouge-3.30.0
Parsing documentation for mercenary-0.3.6
Installing ri documentation for mercenary-0.3.6
Parsing documentation for sass-listen-4.0.0
Installing ri documentation for sass-listen-4.0.0
Parsing documentation for sass-3.7.4
Installing ri documentation for sass-3.7.4
Parsing documentation for jekyll-sass-converter-1.5.2
Installing ri documentation for jekyll-sass-converter-1.5.2
Parsing documentation for jekyll-3.9.3
Installing ri documentation for jekyll-3.9.3
Done installing documentation for rouge, mercenary, sass-listen, sass, jekyll-sass-converter, jekyll after 5 seconds
6 gems installed
```

빌드에 필요한 **JeKyll 플러그인**도 새로 설치합니다.

일반적으로 JeKyll을 삭제할 때 플러그인도 같이 삭제됩니다.

```txt
> gem install jekyll-feed -v 0.15.1
Fetching jekyll-feed-0.15.1.gem
Successfully installed jekyll-feed-0.15.1
Parsing documentation for jekyll-feed-0.15.1
Installing ri documentation for jekyll-feed-0.15.1
Done installing documentation for jekyll-feed after 0 seconds
1 gem installed
> gem install jekyll-paginate -v 1.1.0
Successfully installed jekyll-paginate-1.1.0
Parsing documentation for jekyll-paginate-1.1.0
Done installing documentation for jekyll-paginate after 0 seconds
1 gem installed
```

설치가 끝나고 **페이지를 새로 빌드**하면 오류 없이 잘 실행되는 것을 확인할 수 있습니다.

```txt
> jekyll s
Configuration file: C:/Users/PSJ/Projects/int-i.github.io/_config.yml
            Source: C:/Users/PSJ/Projects/int-i.github.io
       Destination: C:/Users/PSJ/Projects/int-i.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
                    done in 2.402 seconds.
  Please add the following to your Gemfile to avoid polling for changes:
    gem 'wdm', '>= 0.1.0' if Gem.win_platform?
 Auto-regeneration: enabled for 'C:/Users/PSJ/Projects/int-i.github.io'
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```

참고: [Jekyll로 나만의 블로그 만들기](https://int-i.github.io/web/2020-03-10/build-blog-with-jekyll/)
