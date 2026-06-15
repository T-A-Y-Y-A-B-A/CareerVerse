import { useState, useEffect } from 'react'
import { useSounds } from "@/hooks/useSounds"

const ds_course = [
  ['Machine Learning Crash Course by Google [Free]', 'https://developers.google.com/machine-learning/crash-course'],
  ['Machine Learning A-Z by Udemy','https://www.udemy.com/course/machinelearning/'],
  ['Machine Learning by Andrew NG','https://www.coursera.org/learn/machine-learning'],
  ['Data Scientist Master Program of Simplilearn (IBM)','https://www.simplilearn.com/big-data-and-analytics/senior-data-scientist-masters-program-training'],
  ['Data Science Foundations: Fundamentals by LinkedIn','https://www.linkedin.com/learning/data-science-foundations-fundamentals-5'],
  ['Data Scientist with Python','https://www.datacamp.com/tracks/data-scientist-with-python'],
  ['Programming for Data Science with Python','https://www.udacity.com/course/programming-for-data-science-nanodegree--nd104'],
  ['Programming for Data Science with R','https://www.udacity.com/course/programming-for-data-science-nanodegree-with-R--nd118'],
  ['Introduction to Data Science','https://www.udacity.com/course/introduction-to-data-science--cd0017'],
  ['Intro to Machine Learning with TensorFlow','https://www.udacity.com/course/intro-to-machine-learning-with-tensorflow-nanodegree--nd230']
]

const web_course = [
  ['Django Crash course [Free]','https://youtu.be/e1IyzVyrLSU'],
  ['Python and Django Full Stack Web Developer Bootcamp','https://www.udemy.com/course/python-and-django-full-stack-web-developer-bootcamp'],
  ['React Crash Course [Free]','https://youtu.be/Dorf8i6lCuk'],
  ['ReactJS Project Development Training','https://www.dotnettricks.com/training/masters-program/reactjs-certification-training'],
  ['Full Stack Web Developer - MEAN Stack','https://www.simplilearn.com/full-stack-web-developer-mean-stack-certification-training'],
  ['Node.js and Express.js [Free]','https://youtu.be/Oe421EPjeBE'],
  ['Flask: Develop Web Applications in Python','https://www.educative.io/courses/flask-develop-web-applications-in-python'],
  ['Full Stack Web Developer by Udacity','https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd0044'],
  ['Front End Web Developer by Udacity','https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011'],
  ['Become a React Developer by Udacity','https://www.udacity.com/course/react-nanodegree--nd019']
]

const android_course = [
  ['Android Development for Beginners [Free]','https://youtu.be/fis26HvvDII'],
  ['Android App Development Specialization','https://www.coursera.org/specializations/android-app-development'],
  ['Associate Android Developer Certification','https://grow.google/androiddev/#?modal_active=none'],
  ['Become an Android Kotlin Developer by Udacity','https://www.udacity.com/course/android-kotlin-developer-nanodegree--nd940'],
  ['Android Basics by Google','https://www.udacity.com/course/android-basics-nanodegree-by-google--nd803'],
  ['The Complete Android Developer Course','https://www.udemy.com/course/complete-android-n-developer-course/'],
  ['Building an Android App with Architecture Components','https://www.linkedin.com/learning/building-an-android-app-with-architecture-components'],
  ['Android App Development Masterclass using Kotlin','https://www.udemy.com/course/android-oreo-kotlin-app-masterclass/'],
  ['Flutter & Dart - The Complete Flutter App Development Course','https://www.udemy.com/course/flutter-dart-the-complete-flutter-app-development-course/'],
  ['Flutter App Development Course [Free]','https://youtu.be/rZLR5olMR64']
]

const ios_course = [
  ['IOS App Development by LinkedIn','https://www.linkedin.com/learning/subscription/topics/ios'],
  ['iOS & Swift - The Complete iOS App Development Bootcamp','https://www.udemy.com/course/ios-13-app-development-bootcamp/'],
  ['Become an iOS Developer','https://www.udacity.com/course/ios-developer-nanodegree--nd003'],
  ['iOS App Development with Swift Specialization','https://www.coursera.org/specializations/app-development'],
  ['Mobile App Development with Swift','https://www.edx.org/professional-certificate/curtinx-mobile-app-development-with-swift'],
  ['Swift Course by LinkedIn','https://www.linkedin.com/learning/subscription/topics/swift-2'],
  ['Objective-C Crash Course for Swift Developers','https://www.udemy.com/course/objectivec/'],
  ['Learn Swift by Codecademy','https://www.codecademy.com/learn/learn-swift'],
  ['Swift Tutorial - Full Course for Beginners [Free]','https://youtu.be/comQ1-x2a1Q'],
  ['Learn Swift Fast - [Free]','https://youtu.be/FcsY1YPBwzQ']
]

const uiux_course = [
  ['Google UX Design Professional Certificate','https://www.coursera.org/professional-certificates/google-ux-design'],
  ['UI / UX Design Specialization','https://www.coursera.org/specializations/ui-ux-design'],
  ['The Complete App Design Course - UX, UI and Design Thinking','https://www.udemy.com/course/the-complete-app-design-course-ux-and-ui-design/'],
  ['UX & Web Design Master Course: Strategy, Design, Development','https://www.udemy.com/course/ux-web-design-master-course-strategy-design-development/'],
  ['DESIGN RULES: Principles + Practices for Great UI Design','https://www.udemy.com/course/design-rules/'],
  ['Become a UX Designer by Udacity','https://www.udacity.com/course/ux-designer-nanodegree--nd578'],
  ['Adobe XD Tutorial: User Experience Design Course [Free]','https://youtu.be/68w2VwalD5w'],
  ['Adobe XD for Beginners [Free]','https://youtu.be/WEljsc2jorI'],
  ['Adobe XD in Simple Way','https://learnux.io/course/adobe-xd']
]

const resume_videos = [
  'https://youtu.be/Tt08KmFfIYQ','https://youtu.be/y8YH0Qbu5h4',
  'https://youtu.be/u75hUSShvnc','https://youtu.be/BYUy1yvjHxE',
  'https://youtu.be/KFaugkGVeNQ','https://youtu.be/3agP4x8LYFM',
  'https://youtu.be/GyjzOKdaioU','https://youtu.be/17YZBH_qtmg',
  'https://youtu.be/C7pNLIq3kOI','https://youtu.be/xpaz7nrNmXA',
  'https://youtu.be/aKjsy-b00QM','https://youtu.be/ciIkiWwZnlc'
]

const interview_videos = [
  'https://youtu.be/HG68Ymazo18','https://youtu.be/BOvAAoxM4vg',
  'https://youtu.be/KukmClH1KoA','https://youtu.be/7_aAicmPB3A',
  'https://youtu.be/1mHjMNZZvFo','https://youtu.be/WfdtKbAJOmE',
  'https://youtu.be/IBjM-F56qS0','https://youtu.be/4tYoVx0QoN0',
  'https://youtu.be/Ge0Udbws1kc','https://youtu.be/thkuu_FWFD8',
  'https://youtu.be/e0E6-dRPcJA','https://youtu.be/htT1bhFSNxo',
  'https://youtu.be/TZ3C_syg9Ow'
]

interface Profile {
  careerLevel: number
  rolePath: string
  skillScore: number
  experienceScore: number
  projectScore: number
  industryReadiness: number
  xpGained: number
  strengths: string[]
  weaknesses: string[]
  topSkills: string[]
  recommendations: string[]
  summary: string
}

interface Props {
  profile: Profile
  onReUpload: () => void
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 75 ? 'bg-green-500' :
    value >= 50 ? 'bg-yellow-500' :
    'bg-red-500'

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}/100</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function getEmbedUrl(url: string) {
  const id = url.split('/').pop()?.split('?')[0]
  return `https://www.youtube.com/embed/${id}`
}

export function CareerProfile({ profile, onReUpload }: Props) {
  const [bonusVideos, setBonusVideos] = useState<{ resume: string; interview: string } | null>(null)
  const { play } = useSounds()
  
  // Select video guides and courses on mount
  useEffect(() => {
    setBonusVideos({
      resume: resume_videos[Math.floor(Math.random() * resume_videos.length)],
      interview: interview_videos[Math.floor(Math.random() * interview_videos.length)]
    })
  }, [])

  // Find course list matching the role path
  const courses = (() => {
    const rp = profile.rolePath.toLowerCase()
    if (rp.includes('data') || rp.includes('machine') || rp.includes('ml') || rp.includes('ai')) {
      return ds_course
    }
    if (rp.includes('android')) {
      return android_course
    }
    if (rp.includes('ios') || rp.includes('swift')) {
      return ios_course
    }
    if (rp.includes('ux') || rp.includes('ui') || rp.includes('design')) {
      return uiux_course
    }
    // Default fallback to web courses
    return web_course
  })()

  return (
    <div className="space-y-6 pb-12">

      {/* Level header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">
              {profile.careerLevel}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Career Level
            </p>
            <h2 className="text-2xl font-bold">{profile.rolePath}</h2>
            <p className="text-sm text-muted-foreground">+{profile.xpGained} XP earned</p>
          </div>
        </div>
        <button
          onClick={() => { play('snap'); onReUpload(); }}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Re-upload CV
        </button>
      </div>

      {/* Summary */}
      <div className="bg-muted/40 rounded-xl p-4">
        <p className="text-sm leading-relaxed">{profile.summary}</p>
      </div>

      {/* Score bars */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Scores
        </h3>
        <ScoreBar label="Skill Score" value={profile.skillScore} />
        <ScoreBar label="Experience Score" value={profile.experienceScore} />
        <ScoreBar label="Project Score" value={profile.projectScore} />
        <ScoreBar label="Industry Readiness" value={profile.industryReadiness} />
      </div>

      {/* Strengths + Weaknesses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-green-600 dark:text-green-400">
            ✦ Strengths
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.strengths.map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-red-500 dark:text-red-400">
            ✗ Weaknesses
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.weaknesses.map((w) => (
              <span
                key={w}
                className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top Skills */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Top Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.topSkills.map((skill) => (
            <span
              key={skill}
              className="text-sm px-3 py-1 rounded-full border bg-background font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Recommended Next Steps
        </h3>
        <div className="space-y-2">
          {profile.recommendations.map((rec, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40">
              <span className="text-xs font-bold text-primary mt-0.5">{i + 1}</span>
              <p className="text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Course recommendations list */}
      {courses.length > 0 && (
        <div className="space-y-3 pt-4 border-t">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Recommended Courses & Certificates 👨‍🎓
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {courses.map(([cName, cLink], i) => (
              <a
                key={i}
                href={cLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{cName}</span>
                </div>
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bonus Videos */}
      {bonusVideos && (
        <div className="space-y-4 pt-6 border-t">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Bonus Video Guides 💡
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resume Writing Tips</p>
              <div className="aspect-video rounded-xl overflow-hidden border bg-black shadow-inner">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(bonusVideos.resume)}
                  title="Resume Tips"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interview Preparation Tips</p>
              <div className="aspect-video rounded-xl overflow-hidden border bg-black shadow-inner">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(bonusVideos.interview)}
                  title="Interview Tips"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
